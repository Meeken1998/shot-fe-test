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
      <div class="link" v-for="item in links" :key="item._id">
        <div class="info-bar">
          <div class="flex-row" style="gap: 8px;">
            <Switch v-model:checked="item.enabled" style="transform: scale(0.8);"></Switch>
            <div class="title">{{ item.name }}</div>
            <div class="flex-row" style="gap: 4px">
              <div v-for="tag in getTags(item)" :key="tag" class="tag">{{ tag }}</div>
            </div>
          </div>
        </div>

        <Input :value="`https://aside.fun/s/${item._id}`" />
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
import { PlusOutlined } from '@ant-design/icons-vue'
import { createDocsShareLink, getDocsShareLinks, ShareLink } from '@/apis/shareLink'
import { useDocsStore } from '@/store/docs'
import { message } from 'ant-design-vue'

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

onMounted(() => {
  void getData()
})

</script>
<style lang="scss" scoped>
.links {
  padding: 24px 0;
  padding-right: 12px;

  .link {
    .info-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .title {
        font-weight: bold;
        font-size: 15px;
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
        border-radius: 12px;
        transform: scale(0.9);
        user-select: none;
      }
    }
  }
}

.invite-user {
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