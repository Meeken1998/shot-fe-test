<template>
  <div class="sidebar">
    <div class="logo-bar">
      <div class="logo" />
      <h1>StoryBoard</h1>
    </div>

    <div class="menus">
      <div v-for="(val, key) in menuItems" :key="key" class="menu-container">
        <Tooltip v-for="item in val" :key="item.key" :title="item.title" placement="right">
          <div :class="getMenuItemClass(item.key)"
            @click="item.onClick ? item.onClick() : handleMenuKeyChange(item.key)">
            <div class="icon">
              <component v-if="item.icon" :is="item.icon" />
              <Avatar v-if="item.imageUrl" :size="16" :src="item.imageUrl" shape="circle" />
            </div>
            <div class="title" :style="item.parentNode ? { fontWeight: 400 } : {}">{{ item.title }}</div>
          </div>
        </Tooltip>
        <div class="divider" v-if="key !== 'tools' && val.length" />
      </div>
    </div>
  </div>

  <CreateTeamModal :visible="createTeamModalVisible" @close="createTeamModalVisible = false" @ok="handleCreateTeam" />
</template>

<script lang="ts" setup>


import { ref, onMounted } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { HomeFilled, DeleteFilled, PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store'
import CreateTeamModal from '../modal/CreateTeamModal.vue'
import { createTeam, CreateTeamPayload, getTeams } from '@/apis/team'
import { message } from 'ant-design-vue'
import { getActiveMenuItem, MenuItem } from '@/store/dashboard'
import router from '@/views/router'

const createTeamModalVisible = ref(false)

const { sidebarKey, menuItems, activeMenuItem } = storeToRefs(useDashboardStore())

const baseMenuItems: MenuItem[] = [
  {
    title: '首页',
    icon: HomeFilled,
    key: 'home',
    type: 'menu',
  },
  {
    title: '回收站',
    icon: DeleteFilled,
    key: 'recycle',
    type: 'menu',
  },
]

const teamMenuItems = ref<MenuItem[]>([])

function genMenuItems() {
  menuItems.value = {
    baseMenuItems,
    teamMenuItems: teamMenuItems.value,
    tools: [{
      title: '新建团队',
      icon: PlusOutlined,
      onClick: () => createTeamModalVisible.value = true,
      key: 'new',
      type: 'button'
    }]
  }
}

function handleMenuKeyChange(key: string) {
  const menu = getActiveMenuItem(key, menuItems.value) || null
  if (menu?.type === 'team') {
    router.push({
      path: `/team/${menu.key}`
    })
  }
  if (menu?.type === 'menu') {
    router.push({
      path: '/home'
    })
  }
  sidebarKey.value = key
  activeMenuItem.value = menu
}

function getMenuItemClass(key: string) {
  return key === sidebarKey.value ? 'menu-item active' : 'menu-item'
}

async function handleCreateTeam(payload: CreateTeamPayload) {
  const res = await createTeam(payload)
  if (res) {
    void message.success('创建成功')
    createTeamModalVisible.value = false
    void fetchUserTeams()
  }
}

async function fetchUserTeams() {
  const teams = await getTeams()
  teamMenuItems.value = teams.map(t => ({
    title: t.name,
    imageUrl: t.logo,
    key: t.id,
    type: 'team'
  }))
  genMenuItems()
}

async function initSidebarData() {
  await fetchUserTeams()
}

onMounted(() => {
  void initSidebarData()
  sidebarKey.value = 'home'
  activeMenuItem.value = baseMenuItems[0]
})

</script>

<style lang="scss">
.sidebar {
  background-color: $maskColor;
  width: 240px;
  height: 100vh;

  .divider {
    width: calc(100% - 24px);
    height: 1px;
    background-color: #ebebeb;
    margin: 2px 12px;
  }

  .menus {
    width: 100%;
    background-color: $maskColor;
    user-select: none;

    &>.menu-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 4px;
    }

    .menu-item {
      padding: 0 24px;
      height: 40px;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      cursor: pointer;
      width: calc(100% - 24px);
      margin: 0 12px;
      border-radius: $borderRadius;
      font-weight: bold;
      transition: background-color 0.3s;

      .title {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 1.5;
      }

      &:hover {
        background-color: #ebebeb;
      }

      &.active {
        background-color: #e2e2e2;
      }

      .icon {
        width: 16px;
      }
    }
  }

  .logo-bar {
    width: 100%;
    padding: 36px 32px 24px 32px;
    font-size: 18px;
    font-weight: bolder;
    display: flex;
    align-items: center;
    gap: 8px;

    .logo {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: $themeColor;
    }
  }
}
</style>