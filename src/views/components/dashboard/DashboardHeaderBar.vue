<template>
  <div class="header-bar">
    <Input placeholder="搜索 (⌘ + K)" class="cover-radius input" v-model:value="searchVal"
      @change="emit('search', searchVal)">
    <template #prefix>
      <SearchOutlined />
    </template>
    </Input>

    <div :style="{ flexShrink: 0 }">
      <Dropdown>
        <Avatar :size="36" :src="user?.picture"></Avatar>
        <template #overlay>
          <Menu class="user-dropdown">
            <MenuItem class="disabled-menu">
            <div class="userinfo">
              <Avatar :size="36" :src="user?.picture"></Avatar>
              <span>{{ user?.name || user?.nickname || '匿名用户' }}</span>
            </div>
            </MenuItem>
            <MenuDivider />
            <MenuItem>设置</MenuItem>
            <MenuItem @click="logout()">退出登录</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import { sdk } from '@/utils/authing'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const searchVal = ref('')

const emit = defineEmits<{
  (event: 'search', val: string): void
}>()

const { user } = storeToRefs(useDashboardStore())

function logout() {
  sdk.logoutWithRedirect({
    redirectUri: process.env.NODE_ENV !== 'development' ? 'https://aside.fun/login' : 'http://localhost:8080/login',
  }).then(() => {
    localStorage.clear()
  })
}

</script>
<style lang="scss" scope>
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
</style>