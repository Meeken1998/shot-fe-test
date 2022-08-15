<template>
  <div class="team-member">
    <div class="user" v-for="(item) in memberList" :key="item.id">
      <div class="userinfo">
        <Avatar :size="36" :src="item.user.photo" :draggable="false" />
        <div class="content">
          <span class="name">{{ getName(item.user) }}</span>
          <div v-if="user?.sub === item.user.id" class="me">我</div>
        </div>
      </div>

      <div class="role">成员</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getTeamMembers, TeamMemberResponse } from '@/apis/team'
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { onMounted, defineProps, ref } from 'vue'
import { getName } from '@/utils/authing'

const { user } = storeToRefs(useDashboardStore())

const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
})

const memberList = ref<TeamMemberResponse['list']>([])

async function getData() {
  const teamId = props.teamId
  const { list } = await getTeamMembers(teamId)
  memberList.value = list
}

onMounted(() => {
  void getData()
})
</script>
<style lang="scss" scoped>
.team-member {
  width: 100%;
  margin-top: -16px;

  .user {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    padding-right: 8px;
    border-bottom: 1px solid #f0f0f0;

    .role {
      flex-shrink: 0;
      font-size: 13px;
    }

    .userinfo {
      width: 100%;
      display: flex;
      flex-direction: row;

      .content {
        display: flex;
        align-items: center;
        gap: 12px;

        .name {
          font-size: 13px;
        }

        .me {
          background-color: $themeColor;
          padding: 2px 8px;
          border-radius: $borderRadius * 2;
          color: #fff;
          font-size: 12px;
          user-select: none;
        }
      }
    }
  }

}
</style>