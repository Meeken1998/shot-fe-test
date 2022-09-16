<template>
  <div class="invite-user">
    <Button v-if="!isCreateMode" type="primary" class="primary-btn-mini" @click="isCreateMode = true">
      <template #icon>
        <PlusOutlined />
      </template>
      生成分享链接
    </Button>

    <div v-else class="create">
      <div class="flex-row" style="gap: 12px">
        <Button type="primary" class="primary-btn-mini" @click="handleCreateShareLink()">完成生成</Button>
        <Button class="primary-btn-mini" @click="isCreateMode = false">取消</Button>
      </div>

      <div class="form">
        <div class="item">
          <div class="title">备注</div>
          <Input class="input" style="flex: 1;" placeholder="内部可见的分享链接备注（可选）" v-model:value="remark" />
        </div>
        <div class="item">
          <div class="title">地址</div>
          <Input disabled class="input" addon-before="https://aside.fun/" style="flex: 1;" placeholder="自动分配" />
        </div>
        <div class="item">
          <div class="title">授予权限</div>
          <CheckboxGroup :options="roleActions" v-model:value="selectedRoleActions"></CheckboxGroup>
        </div>
        <div class="item">
          <div class="title">高级选项</div>
          <Checkbox v-model:checked="isAutoPlay">自动进入全屏放映模式</Checkbox>
        </div>
      </div>
    </div>

    <div v-if="!isCreateMode" class="links">
      <div class="link" v-for="(item, index) in links" :key="item._id">
        <div class="info-bar">
          <div class="flex-row" style="gap: 8px;">
            <Switch v-model:checked="item.enabled" style="transform: scale(0.8);margin-left: -4px;"
              @change="() => handleChangeLinkEnable(item, index)"></Switch>
            <div class="title">{{ item.name }}</div>
            <div class="flex-row" style="gap: 1px">
              <div v-for="tag in getTags(item)" :key="tag" class="tag">{{ tag }}</div>
            </div>
          </div>

          <div class="metrics-bar">
            <Tooltip title="数据统计">
              <div class="flex-row icon-btn" style="gap: 4px;">
                <PieChartFilled />
                <div>0</div>
              </div>
            </Tooltip>

            <Tooltip title="设置">
              <SettingOutlined class="icon-btn"></SettingOutlined>
            </Tooltip>
          </div>
        </div>

        <Input :value="`https://aside.fun/s/${item._id}`">
        <template #suffix>
          <Tooltip title="复制链接">
            <CopyOutlined class="icon-btn" @click="handleCopyLink(item._id)"></CopyOutlined>
          </Tooltip>
        </template>
        </Input>
      </div>
    </div>

    <SelectUsersModal :visible="isSelectUsersModalVisible" title="选择被分享文档的用户"
      @close="isSelectUsersModalVisible = false">
    </SelectUsersModal>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import SelectUsersModal from './SelectUsersModal.vue'
import { PlusOutlined, PieChartFilled, CopyOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { createDocsShareLink, getDocsShareLinks, ShareLink, updateDocsShareLink } from '@/apis/shareLink'
import { useDocsStore } from '@/store/docs'
import { message } from 'ant-design-vue'
import { copyText } from '@/utils/clipboard'


const docsStore = useDocsStore()

const docsId = docsStore.docs?._id || ''

const isSelectUsersModalVisible = ref(false)
const isCreateMode = ref(false)
const selectedRoleActions = ref(['docs:read'])
const isAutoPlay = ref(false)
const remark = ref<string>()

const links = ref<ShareLink[]>([])

const roleActions = [
  {
    label: '可阅读',
    value: 'docs:read',
    disabled: true,
  },
  {
    label: '可编辑',
    value: 'docs:write'
  },
  {
    label: '可分享',
    value: 'docs:share'
  }
]

async function getData() {
  const res = await getDocsShareLinks(docsId)
  links.value = res
}

async function handleCreateShareLink() {
  const res = await createDocsShareLink(docsId, selectedRoleActions.value, remark.value, isAutoPlay.value)
  if (res._id) {
    void message.success('创建成功')
    await getData()
    isCreateMode.value = false
  }
}

async function handleChangeLinkEnable(item: ShareLink, idx: number) {
  const res = await updateDocsShareLink(item._id, {
    enabled: item.enabled
  })
  if (res._id) {
    void message.success(`${item.enabled ? '开启' : '关闭'}成功`)
    const newLinks = links.value.slice()
    newLinks[idx] = res
    links.value = newLinks
  }
}

function getTags(link: ShareLink) {
  const roleMapper: Record<string, string> = {
    'docs:read': '可阅读',
    'docs:write': '可编辑',
    'docs:share': '可分享',
  }
  const res = (link.resourceActions || []).map(r => roleMapper[r]).filter(r => r)
  if (link.configs?.autoplay) {
    res.unshift('演示模式')
  }
  return res
}

function handleCopyLink(id: string) {
  copyText(`https://aside.fun/s/${id}`)
  void message.success('复制成功')
}

onMounted(() => {
  void getData()
})

</script>
<style lang="scss" scoped>
.icon-btn {
  cursor: pointer;
  color: $grayColor;

  &:hover {
    color: $themeColor;
  }
}

.metrics-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;

  .icon {
    color: $themeColor;
  }
}

.links {
  padding: 24px 0;
  padding-right: 12px;

  .link {
    &:not(:first-child) {
      margin-top: 32px;
    }

    .info-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .title {
        font-weight: bold;
        font-size: 14px;
      }

      .tag {
        font-size: 13px;
        color: #fff;
        background-color: $themeColor;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 8px;
        border-radius: 6px;
        transform: scale(0.84);
        user-select: none;
      }
    }
  }
}

.invite-user {
  max-width: 510px;

  .form {
    width: 400px;
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .item {
      display: flex;
      align-items: center;
      height: 32px;

      .title {
        font-size: 13px;
        color: #888;
        flex-shrink: 0;
        width: 72px;
      }
    }
  }
}
</style>