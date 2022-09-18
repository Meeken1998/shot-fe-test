<template>
  <div v-if="enabledStyle && canIUse" :style="enabledStyle">
    <slot></slot>
  </div>
  <slot v-else-if="canIUse"></slot>
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import { PropType, computed, StyleValue } from 'vue'

const dashboard = useDashboardStore()
const props = defineProps({
  resourceName: {
    type: String,
    required: true,
  },
  resourceId: {
    type: String,
    required: false,
    default: '*',
  },
  actions: {
    type: Array as unknown as PropType<string[]>,
    required: true,
  },
  enabledStyle: {
    type: Object as PropType<StyleValue>,
    required: false,
  }
})

const canIUse = computed(() => {
  const { resourceName, resourceId, actions } = props
  if (!actions.length) {
    return true
  }
  const enabledActions = dashboard.userResources?.[`${resourceName}:${resourceId}`] || []
  return actions.every(act => enabledActions.includes(act))
})
</script>