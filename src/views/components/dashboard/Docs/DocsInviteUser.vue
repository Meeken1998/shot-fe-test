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
        <Button type="primary" class="primary-btn-mini">完成生成</Button>
        <Button class="primary-btn-mini" @click="isCreateMode = false">取消</Button>
      </div>

      <div class="form">
        <div class="item">
          <div class="title">备注</div>
          <Input class="input" style="flex: 1;" placeholder="内部可见的分享链接备注（可选）" />
        </div>
        <div class="item">
          <div class="title">地址</div>
          <Input class="input" addon-before="https://aside.fun/" style="flex: 1;" placeholder="自动分配" />
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

    <SelectUsersModal :visible="isSelectUsersModalVisible" title="选择被分享文档的用户"
      @close="isSelectUsersModalVisible = false">
    </SelectUsersModal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import SelectUsersModal from './SelectUsersModal.vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const isSelectUsersModalVisible = ref(false)
const isCreateMode = ref(false)
const selectedRoleActions = ref(['docs:read'])
const isAutoPlay = ref(false)

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

</script>
<style lang="scss" scoped>
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