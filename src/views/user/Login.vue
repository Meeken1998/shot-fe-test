<template>
  <div class="login-page">
    跳转中，请稍后...
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/store'
import { storeToRefs } from 'pinia'
import { sdk } from '@/utils/authing'
import router from '../router'
const { user, loginState } = storeToRefs(useDashboardStore())

const login = () => {
  sdk.loginWithRedirect()
}

function redirect() {
  // 判断邀请链接
  const inviteId = localStorage.getItem('inviteId')
  if (inviteId) {
    localStorage.removeItem('inviteId')
    router.push({
      path: `/join-team/${inviteId}`
    })
    return
  }
  const shareLinkId = localStorage.getItem('shareLinkId')
  if (shareLinkId) {
    localStorage.removeItem('shareLinkId')
    router.push({
      path: `/share/${shareLinkId}`
    })
    return
  }
  router.push({
    name: 'home'
  })
}

const getLoginState = async () => {
  try {
    const res = await sdk.getLoginState()
    loginState.value = res
    if (!res?.accessToken) {
      throw new Error()
    }
    else {
      saveUserInfo2store()
      redirect()
    }
  }
  catch {
    login()
  }
}

onMounted(() => {
  void checkLoginState()
})

async function checkLoginState() {
  try {
    if (!sdk.isRedirectCallback()) {
      void getLoginState()
      return
    }
    const callback = await sdk.handleRedirectCallback()
    loginState.value = callback
    let token = ''
    if (callback?.idToken) {
      token = callback.idToken
      localStorage.setItem('token', token)
    }
    await saveUserInfo2store()
    redirect()
  }
  catch (err) {
    login()
  }
}

async function saveUserInfo2store() {
  try {
    const userInfo = await sdk.getUserInfo()
    if (userInfo) {
      user.value = userInfo
    }
  }
  catch {
    login()
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
}
</style>