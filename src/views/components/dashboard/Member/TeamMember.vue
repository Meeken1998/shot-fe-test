<template>
  <div class="team-member-page">
    <TeamInfo @info="handleGetTeamInfo">
      <DivWithResources resource-name="team" :actions="['team:add_member']">
        <Button class="primary-btn" @click="manageiIviteLinkModalVisible = true">邀请链接管理</Button>
        <Button class="primary-btn" type="primary" @click="inviteModalVisible = true">邀请成员</Button>
      </DivWithResources>
    </TeamInfo>
    <div v-if="!loading" class="team-member">
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

    <div v-else class="team-member">
      <div v-for="(_, key) in Array(2).fill(null)" :key="key" class="user">
        <div class="userinfo">
          <Skeleton circle width="36px" height="36px" />
          <div class="content">
            <span class="name">
              <Skeleton width="180px" height="20px" />
            </span>
          </div>
        </div>
        <div />
      </div>
    </div>
    <InviteModal :visible="inviteModalVisible" @close="inviteModalVisible = false" :team-id="teamInfo?.id!"
      :team-name="teamInfo?.name!" />

    <ManageInviteLinkModal :visible="manageiIviteLinkModalVisible" @close="manageiIviteLinkModalVisible = false"
      :team-id="teamInfo?.id!" />
  </div>
</template>
<script lang="ts" setup>
import { getTeamMembers, Team, TeamMemberResponse } from '@/apis/team'
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { getName } from '@/utils/authing'
import TeamInfo from '../Team/TeamInfo.vue'
import InviteModal from '../Team/InviteModal.vue'
import { useRoute } from 'vue-router'
import ManageInviteLinkModal from '../Team/ManageInviteLinkModal.vue'
import DivWithResources from '../../role/DivWithResources.vue'

const route = useRoute()
const inviteModalVisible = ref(false)
const manageiIviteLinkModalVisible = ref(false)
const teamInfo = ref<Team>()
const loading = ref(true)

const dashboardStore = useDashboardStore()
const { user, activeHeaderBarMenuKey } = storeToRefs(dashboardStore)

const memberList = ref<TeamMemberResponse['list']>([])

async function getData() {
  const { teamId } = route.params as Record<string, string>
  if (!teamId) return
  activeHeaderBarMenuKey.value = 'member'
  loading.value = true
  const { list } = await getTeamMembers(teamId)
  memberList.value = list
  loading.value = false
}

function handleGetTeamInfo(team: Team) {
  teamInfo.value = team
  dashboardStore.setCurrentTeam(team)
}

onMounted(() => {
  void getData()
})

watch(() => route.params?.teamId, () => void getData())

</script>
<style lang="scss" scoped>
.team-member-page {
  margin-top: 44px;
  padding: 0 44px;
}

.team-member {
  width: 100%;
  margin-top: 24px;

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