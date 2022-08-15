<template>
  <div class="project-wrapper">
    <div v-for="item in (props.items || [])" :key="item.id">
      <Project :item="item" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ProjectItem } from '@/types/project'
import { defineProps, PropType } from 'vue'
import Project from './Project.vue'

const props = defineProps({
  items: {
    type: Array as PropType<ProjectItem[]>,
    require: true
  }
})
</script>
<style lang="scss" scoped>
.project-wrapper {
  width: 100%;
  display: grid;
  gap: 16px;
  margin: 0 $borderRadius * -1;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
</style>