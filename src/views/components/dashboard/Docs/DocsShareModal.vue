<template>
  <Modal :visible="visible" @cancel="emit('close')" title="分享" :width="720" :footer="null" centered>
    <div class="share-modal-container">
      <div style="flex-shrink: 0;">
        <div class="menu-container side-menu">
          <div :class="{
            'menu-item': true,
            'active': shareMode === 'user'
          }" @click="shareMode = 'user'">
            定向邀请
          </div>
          <div :class="{
            'menu-item': true,
            'active': shareMode === 'universal'
          }" @click="shareMode = 'universal'">
            链接邀请
          </div>
        </div>
        <div class="shot-menu-item version-manage">版本管理</div>
      </div>


      <div class="menu-box">
        <DocsInviteUser v-if="shareMode === 'universal'" />
        <DocsInviteUser v-if="shareMode === 'user'" select-user />
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import DocsInviteUser from './DocsInviteUser.vue'

const shareMode = ref<'user' | 'universal'>('user')

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>
<style lang="scss">
.share-modal-container {
  display: flex;
  gap: 24px;
}

.menu-box {
  flex: 1;
  height: 100%;
  max-height: 400px;
  overflow-y: auto;
}

.ant-modal-body {
  padding: 16px;
}

.version-manage {
  margin: 0;
  padding: 0 16px;
}

.side-menu {
  width: 140px;
  display: flex;
  flex-direction: column;
  height: 360px;

  .menu-item {
    margin: 0;
    width: 100%;
    padding: 0 16px;

    &:not(:first-child) {
      margin-top: 4px;
    }
  }
}
</style>