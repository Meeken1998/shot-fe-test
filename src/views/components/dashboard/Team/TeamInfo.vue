<template>
  <div v-if="teamInfo" class="team-info">
    <Avatar :size="84" :src="teamInfo.logo" :draggable="false" class="icon" />
    <div class="content">
      <div class="left">
        <div class="title">{{ teamInfo.name }}</div>
        <div class="desc">{{ teamInfo.description }}</div>
      </div>

      <div class="right">
        <slot></slot>
      </div>
    </div>
  </div>

  <div v-else class="team-info">
    <Skeleton circle width="84px" height="84px" />
    <div class="content">
      <div class="left">
        <div>
          <Skeleton class="title" height="20px" width="180px" />
        </div>
        <div>
          <Skeleton class="desc" height="20px" width="360px" />
        </div>
      </div>

      <div />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getTeamDetail, Team } from '@/apis/team'
import { onMounted, ref, watch, defineEmits } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const teamInfo = ref<Team>()

watch(() => route.params?.teamId, getData)

const emit = defineEmits<{
  (event: 'info', team: Team): void
}>()

async function getData() {
  const { teamId } = route.params as Record<string, string>
  const team = await getTeamDetail(teamId)
  teamInfo.value = team
  emit('info', team)
}

onMounted(() => {
  void getData()
})
</script>
<style lang="scss" scoped>
.team-info {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
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
</style>