<template>
  <div class="project-wrapper">
    <div v-for="item in (props.items || [])" :key="item._id">
      <Project :item="item" :team="props.team" @delete="emit('delete')" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Docs } from '@/apis/docs'
import { Team } from '@/apis/team'
import { defineProps, PropType } from 'vue'
import Project from './Project.vue'

const emit = defineEmits<{
  (event: 'delete'): void
}>()

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
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
</style>