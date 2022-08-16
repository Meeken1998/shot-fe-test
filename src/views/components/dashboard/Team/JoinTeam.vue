<template>
  <div class="join-invite-page">
    <div v-if="teamInfo && inviteInfo && inviterInfo" class="invite-card">
      <Avatar :size="100" :src="teamInfo?.logo" :draggable="false" />

      <div class="content">
        <div>
          <span class="bold">{{ teamInfo?.name }}</span>
          <span> 的 </span>
          <span class="bold">{{ getName(inviterInfo) }}</span>
        </div>
        <div>
          正在邀请你加入团队
        </div>
        <div v-if="inviteInfo?.outdateTimestamp" class="tips">这个邀请链接将在
          {{ Math.ceil((inviteInfo.outdateTimestamp -
              Date.now()) / 86400000)
          }} 天后过期</div>
      </div>

      <Button type="primary" class="primary-btn-large" @click="handleJoin()">加入团队</Button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTeamInviteInfo, Team, TeamInvite, acceptTeamInvite } from '@/apis/team'
import { getUserInfoById } from '@/apis/user'
import { User } from 'authing-js-sdk'
import { getName } from '@/utils/authing'
import { message, Modal } from 'ant-design-vue'
import router from '@/views/router'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store'

const route = useRoute()
const { inviteId } = route.params as Record<string, string>
const teamInfo = ref<Team>()
const inviteInfo = ref<TeamInvite>()
const inviterInfo = ref<User>()

const { loginState } = storeToRefs(useDashboardStore())

async function getData() {
  const { team, invite } = await getTeamInviteInfo(inviteId)
  teamInfo.value = team
  inviteInfo.value = invite
  const inviter = await getUserInfoById(invite?.inviterUserId)
  inviterInfo.value = inviter
}

function handleAcceptInviteAfterLogin() {
  Modal.confirm({
    title: '未登录',
    content: '加入团队前，请先登录账号',
    okText: '去登录',
    cancelText: '取消',
    centered: true,
    onOk: () => {
      localStorage.setItem('inviteId', inviteId)
      router.push({
        name: 'login',
      })
    }
  })
}

async function handleJoin() {
  if (!loginState.value && !localStorage.getItem('token')) {
    handleAcceptInviteAfterLogin()
    return
  }
  const res = await acceptTeamInvite(inviteId)
  if (res) {
    void message.success(`你已成功加入 ${teamInfo.value?.name}`)
    setTimeout(() => {
      router.push({
        path: `/team/${teamInfo.value?.id}`
      })
    }, 1000)
  }
}

onMounted(() => {
  void getData()
})
</script>
<style lang="scss" scoped>
.join-invite-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;

  .invite-card {
    width: 500px;
    height: 400px;
    background-color: #fff;
    border-radius: $borderRadius;
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .content {
      font-size: 16px;
      text-align: center;
      line-height: 1.8;

      .bold {
        font-weight: bold;
      }

      .tips {
        color: #999;
        font-size: 13px;
        margin-top: 16px;
      }
    }
  }
}
</style>