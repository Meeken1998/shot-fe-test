<template>
  <div class="team-page page-container">
    <GuideBar />

    <div v-if="!loading">
      <div class="tools-bar">
        <div class="left-side">
          <div class="flex-row">
            <div class="title">团队内全部内容</div>
            <div class="filter flex-row">
              <span>按时间排序</span>
              <DownOutlined class="icon" />
            </div>
          </div>
          <a class="flex-row search-by-rules">
            <PlusCircleFilled />
            <span>增加筛选条件</span>
          </a>
        </div>

        <div v-if="teamInfo?.id" class="flex-row right-side">

          <UploadWrapper :team-id="teamInfo.id" accept=".pdf" id="upload_pdf" @file="file => handleGetPdfFile(file)">
            <Button class="primary-btn load-btn">
              从 PDF 导入
            </Button>
          </UploadWrapper>
          <UploadWrapper :team-id="teamInfo.id" accept=".ppt,.pptx" id="upload_ppt"
            @file="file => handleGetPptFile(file)">
            <Button class="primary-btn load-btn">
              <template #icon>
                <img :draggable="false" class="ppt-icon" src="https://static.aside.fun/upload/ppt-icon.png" />
              </template>
              从 PPTX 导入
            </Button>
          </UploadWrapper>
          <router-link :to="{ path: `/createDocs`, query: { teamId: teamInfo?.id } }" target="_blank">
            <Button type="primary" class="primary-btn">新建</Button>
          </router-link>
        </div>
      </div>
      <div class="docs-container">
        <Empty v-if="!docs?.length" :style="{ marginTop: '200px' }" />
        <ProjectWrapper :items="docs || []" :team="teamInfo" />
      </div>

    </div>

    <div v-else>
      <div class="loading-wrapper docs-container">
        <div v-for="(_, key) in Array(8).fill(null)" :key="key" class="item">
          <Skeleton width="100%" height="240px"></Skeleton>
          <Skeleton width="60%" class="title" height="16px"></Skeleton>
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { getTeamDetail, getTeamDocs, Team } from '@/apis/team'
import { useRoute } from 'vue-router'
import { getActiveMenuItem } from '@/store/dashboard'
import { setTitle } from '@/utils/title'
import ProjectWrapper from '../../project/ProjectWrapper.vue'
import GuideBar from '../GuideBar/GuideBar.vue'
import { Docs, uploadPptDocs, getDocsConvertProgress, DocsConvertProcessStatus } from '@/apis/docs'
import { DownOutlined, PlusCircleFilled } from '@ant-design/icons-vue'
import UploadWrapper from '../../widget/UploadWrapper.vue'
import { message } from 'ant-design-vue'
import { sleep } from '@/utils/sleep'
import useCreateDocs from '@/hooks/useCreateDocs'

const dashboardStore = useDashboardStore()
const { activeMenuItem, sidebarKey, menuItems, currentTeam } = storeToRefs(dashboardStore)
const docs = ref<Docs[]>()
const route = useRoute()
const teamInfo = ref<Team>()
const loading = ref(true)

async function getData() {
  const { teamId } = route.params as Record<string, string>
  if (!teamId) return
  loading.value = true
  // 刷新左侧菜单
  sidebarKey.value = teamId
  activeMenuItem.value = getActiveMenuItem(teamId, menuItems.value) || null
  docs.value = await getTeamDocs(teamId)
  const team = await getTeamDetail(teamId)
  teamInfo.value = team
  currentTeam.value = team
  setTitle(team.name)
  loading.value = false
}

async function handleGetPptFile(file: File) {
  const docsId = await uploadPptDocs(teamInfo.value!.id, file)
  await checkDocsConvertProgress(docsId)
}

async function handleGetPdfFile(file: File) {
  const { createPdfDocs } = useCreateDocs()
  const docs = await createPdfDocs(file, teamInfo.value!.id)
  void message.success('创建成功')
  window.open(`/viewer/${docs?._id}`, '_blank')
}

async function checkDocsConvertProgress(docsId: string) {
  const TTL = 1000
  // window.open(`/editor/${docs._id}`, '_blank')
  const info = await getDocsConvertProgress(docsId)
  if (!info) {
    void message.warning('上传失败，网络错误')
    return
  }
  if (info?.status !== DocsConvertProcessStatus.FINISHED) {
    await sleep(TTL)
    await checkDocsConvertProgress(docsId)
  }
  else {
    void message.success('创建成功')
    window.open(`/editor/${docsId}`, '_blank')
  }
}

watch(() => route.params?.teamId, getData)

onMounted(() => {
  void getData()
  dashboardStore.setActiveHeaderBarMenuKey('team')
})
</script>
<style lang="scss">
.team-page {
  width: 100%;

  .load-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    .ppt-icon {
      width: 16px;
      height: 16px;
    }
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .tools-bar {
    margin-top: 24px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .right-side {
      gap: 16px;
    }

    .search-by-rules {
      margin-top: 16px;
      gap: 4px;
      display: inline-flex;
      user-select: none;
    }

    .filter {
      margin-left: 12px;
      font-size: 13px;
      color: rgba(61, 61, 61, 1);
      margin-top: 8px;
      user-select: none;
      cursor: pointer;

      .icon {
        margin-left: 4px;
        color: rgba(61, 61, 61, 0.4);
        font-size: 10px;
      }
    }
  }

  .title {
    font-size: 20px;
    font-weight: bold;
  }

  .tabs {
    margin-top: 24px;

    .ant-tabs-tab {
      padding: 8px 0 !important;
    }
  }

  .docs-container {
    margin-top: 24px;
    width: 100%;
  }

  .loading-wrapper {
    width: 100%;
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));

    .item {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }
}
</style>