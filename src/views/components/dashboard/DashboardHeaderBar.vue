<template>
  <header class="header-bar">
    <div class="left-side">
      <div class="logo-bar">
        <img class="logo" src="https://static.aside.fun/upload/shot-logo.svg" :draggable="false" />
      </div>
    </div>
    <div class="right-side">
      <div v-if="props.showMenu" class="headerbar-menu-container">
        <div v-for="item in headerBarMenuItems" :key="item.key">
          <DivWithResources :resource-name="item?.resourceOptions?.resourceName || ''"
            :actions="item?.resourceOptions?.actions || []" :enabled-style="{ marginRight: '24px' }">
            <a :class="getHeaderBarMenuItemClass(item.key)" @click="handleSwitchHeaderBarItem(item.key)">
              <span class="icon">
                <component v-if="item.icon" :is="item.icon" />
              </span>
              <span>{{ isLargeScreen ? item.name : item.shortened }}</span>
            </a>
          </DivWithResources>
        </div>
      </div>
      <div v-else class="headerbar-menu-container">
        <slot></slot>
      </div>
      <Input v-if="props.showMenu" placeholder="搜索功能或者幻灯片内容 (⌘ + K)" class="cover-radius input search-input"
        v-model:value="searchVal" @change="emit('search', searchVal)">
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
              <router-link :to="{ path: '/profile' }">
                <MenuItem>个人设置</MenuItem>
              </router-link>
              <MenuItem @click="logout()">退出登录</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { useDashboardStore, useScreenStore } from '@/store'
import { sdk } from '@/utils/authing'
import { storeToRefs } from 'pinia'
import { ref, defineProps, computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import router from '@/views/router'
import { useRoute } from 'vue-router'
import DivWithResources from '../role/DivWithResources.vue'
const route = useRoute()

const searchVal = ref('')

const emit = defineEmits<{
  (event: 'search', val: string): void
}>()

const dashboardStore = useDashboardStore()
const screenStore = useScreenStore()
const { user, headerBarMenuItems, activeHeaderBarMenuKey } = storeToRefs(dashboardStore)
const { clientWidth } = storeToRefs(screenStore)

const isLargeScreen = computed(() => clientWidth.value >= 1440)
const props = defineProps({
  showMenu: {
    type: Boolean,
    required: false,
    default: true,
  }
})

function getHeaderBarMenuItemClass(key: string) {
  return key !== activeHeaderBarMenuKey.value ? 'headerbar-menu-item' : 'headerbar-menu-item active'
}

function handleSwitchHeaderBarItem(key: string) {
  const { teamId } = route.params as Record<string, string>
  router.push({
    path: `/${key}/${teamId}`
  })
}

function logout() {
  sdk.logoutWithRedirect({
    redirectUri: process.env.NODE_ENV !== 'development' ? 'https://aside.fun/login' : 'http://localhost:8080/login',
  }).then(() => {
    localStorage.clear()
  })
}

</script>
<style lang="scss">
.header-bar {
  width: 100%;
  padding: 8px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #ebebeb;

  .left-side {
    flex-shrink: 0;
  }

  .right-side {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 24px;

    .search-input {
      width: 300px;
      flex-shrink: 0;
    }
  }
}

.logo-bar {
  width: calc(224px);
  font-size: 18px;
  font-weight: bolder;
  display: flex;
  align-items: center;
  gap: 8px;

  .logo {
    height: 50px;
  }
}

.headerbar-menu-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  cursor: pointer;
  user-select: none;

  .headerbar-menu-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    font-size: 14px;
    color: #333;

    &:hover {
      color: rgba($themeColor, 0.8);
    }

    &.active {
      color: $themeColor;
    }
  }
}
</style>