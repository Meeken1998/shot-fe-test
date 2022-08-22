<template>
  <div class="project-wrapper">
    <div v-for="item in (props.items || [])" :key="item._id">
      <Project :item="item" :team="props.team" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Docs } from '@/apis/docs'
import { Team } from '@/apis/team'
import { defineProps, PropType } from 'vue'
import Project from './Project.vue'

const props = defineProps({
  items: {
    type: Array as PropType<Docs[]>,
    required: true
  },
  team: {
    type: Object as PropType<Team>,
    required: false
  }
})
</script>
<style lang="scss" scoped>
.project-wrapper {
  width: 100%;
  height: calc(100vh - 260px);
  overflow: auto;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
</style>