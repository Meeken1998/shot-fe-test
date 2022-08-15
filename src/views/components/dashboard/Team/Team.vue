<template>
  <div class="team-page">
    <div class="info">
      <Avatar :size="84" :src="teamDetail?.team.logo" :draggable="false" class="icon" />
      <div class="content">
        <div class="left">
          <div class="title">{{ teamDetail?.team.name }}</div>
          <div class="desc">{{ teamDetail?.team.description }}</div>
        </div>

        <div class="right">
          <router-link :to="{ name: 'editor' }" target="_blank">
            <Button class="primary-btn">新建文档</Button>
          </router-link>
          <Button class="primary-btn" @click="inviteModalVisible = true">邀请成员</Button>
        </div>
      </div>
    </div>

    <Tabs v-model:activeKey="tabKey" class="tabs">
      <TabPane key="brief" tab="文档">
        <Empty v-if="!teamDetail?.docsMetaDatas?.length" :style="{ marginTop: '200px' }" />
      </TabPane>
      <TabPane key="member" tab="成员">
        <TeamMember :team-id="teamDetail?.team.id!" />
      </TabPane>
      <TabPane key="settings" tab="设置"></TabPane>
    </Tabs>
  </div>

  <InviteModal :visible="inviteModalVisible" @close="inviteModalVisible = false" :team-id="teamDetail?.team?.id!"
    :team-name="teamDetail?.team?.name!" />
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { getTeamDetail, TeamDetail } from '@/apis/team'
import { useRoute } from 'vue-router'
import { getActiveMenuItem } from '@/store/dashboard'
import TeamMember from './TeamMember.vue'
import InviteModal from './InviteModal.vue'
import { setTitle } from '@/utils/title'

const { activeMenuItem, sidebarKey, menuItems } = storeToRefs(useDashboardStore())
const teamDetail = ref<TeamDetail>()
const inviteModalVisible = ref(false)
const tabKey = ref<'brief' | 'member' | 'settings'>('brief')
const route = useRoute()

async function getData() {
  const { id: teamId } = route.params as Record<string, string>
  // 刷新左侧菜单
  sidebarKey.value = teamId
  activeMenuItem.value = getActiveMenuItem(teamId, menuItems.value) || null
  teamDetail.value = await getTeamDetail(teamId)
  setTitle(teamDetail.value.team.name)
}

watch([
  () => route.params?.id
], () => {
  if (route.params?.id) void getData()
})

onMounted(() => {
  void getData()
})
</script>
<style lang="scss">
.team-page {
  width: 100%;
  padding: 0 36px;

  .info {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 36px;
    gap: 24px;

    .icon {
      flex-shrink: 0;
    }

    .content {
      line-height: 1.8;
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        flex: 1;

        .title {
          font-size: 24px;
          font-weight: bold;
        }

        .desc {
          font-size: 14px;
          color: #666;
        }
      }

      .right {
        flex-shrink: 0;
        display: flex;
        gap: 16px;
      }
    }
  }

  .tabs {
    margin-top: 24px;

    .ant-tabs-tab {
      padding: 8px 0 !important;
    }
  }
}
</style>