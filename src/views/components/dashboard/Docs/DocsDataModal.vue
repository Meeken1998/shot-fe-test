<template>
  <Modal :visible="visible" @cancel="emit('close')" :width="1000" title="数据分析" :footer="null" centered>
    <div class="data-modal">
      <div style="flex-shrink: 0;">
        <div class="menu-container side-menu">
          <div v-for="item in modeMenu" :key="item.mode" :class="{
            'menu-item': true,
            'active': mode === item.mode
          }" @click="mode = item.mode">
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="mode-container">
        <DocsUserVisitData v-if="mode === 'users'"></DocsUserVisitData>
        <DocsLinkVisitData v-if="mode === 'links'"></DocsLinkVisitData>
        <DocsMetricsBrief v-if="mode === 'brief'"></DocsMetricsBrief>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import DocsUserVisitData from './data/DocsUserVisitData.vue'
import DocsLinkVisitData from './data/DocsLinkVisitData.vue'
import DocsMetricsBrief from './data/DocsMetricsBrief.vue'

const modeMenu = [{
  name: '访问用户分析',
  mode: 'users'
}, {
  name: '邀请链接分析',
  mode: 'links'
}, {
  name: '内容分析',
  mode: 'brief'
}]

const mode = ref('users')

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
<style lang="scss" scoped>
.data-modal {
  height: 500px;
  overflow-y: auto;
  display: flex;
  justify-content: space-between;
  gap: 24px;

  .mode-container {
    flex: 1;
    // padding-right: 16px;
    height: 100%;
    overflow-y: auto;
  }
}
</style>