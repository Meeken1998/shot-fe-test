<template>
  <div class="sidebar">
    <div v-if="!loading" class="menus">
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

    <div v-else class="menu">
      <div v-for="(_, key) in Array(3).fill(null)" :key="key" class="fake-data">
        <div class="avatar" />
        <Skeleton :width="`${key * 20 + 60}px`" height="20px" />
      </div>
      <br />
      <div v-for="(_, key) in Array(1).fill(null)" :key="key" class="fake-data">
        <Skeleton class="avatar" circle />
        <Skeleton width="140px" height="20px" />
      </div>
      <div v-for="(_, key) in Array(2).fill(null)" :key="key" class="fake-data">
        <div class="avatar" />
        <Skeleton width="140px" height="20px" />
      </div>
      <br />
      <div v-for="(_, key) in Array(1).fill(null)" :key="key" class="fake-data">
        <Skeleton class="avatar" circle />
        <Skeleton width="140px" height="20px" />
      </div>
      <div v-for="(_, key) in Array(2).fill(null)" :key="key" class="fake-data">
        <div class="avatar" />
        <Skeleton width="140px" height="20px" />
      </div>
    </div>
  </div>

  <CreateTeamModal :visible="createTeamModalVisible" @close="createTeamModalVisible = false" @ok="handleCreateTeam" />
</template>

<script lang="ts" setup>


import { ref, onMounted } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PlusOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store'
import CreateTeamModal from '../modal/CreateTeamModal.vue'
import { createTeam, CreateTeamPayload, getTeams } from '@/apis/team'
import { message } from 'ant-design-vue'
import { getActiveMenuItem, MenuItem } from '@/store/dashboard'
import router from '@/views/router'
import { useRoute } from 'vue-router'
const route = useRoute()

const createTeamModalVisible = ref(false)

const { sidebarKey, menuItems, activeMenuItem, activeHeaderBarMenuKey } = storeToRefs(useDashboardStore())

const teamMenuItems = ref<MenuItem[]>([])
const loading = ref(true)

const props = defineProps({
  isOutOfTeam: {
    type: Boolean,
    required: false
  }
})

function genMenuItems() {
  menuItems.value = {
    teamMenuItems: teamMenuItems.value,
    tools: [{
      title: '新建团队',
      icon: PlusOutlined,
      onClick: () => createTeamModalVisible.value = true,
      key: 'new',
      type: 'button'
    }]
  }

  const { teamId } = route.params as Record<string, string>

  if (teamId) {
    sidebarKey.value = teamId
    activeMenuItem.value = getActiveMenuItem(teamId, menuItems.value) || null
  }
  else {
    sidebarKey.value = teamMenuItems.value[0].key
    activeMenuItem.value = teamMenuItems.value[0]
    if (!route.meta?.title) {
      router.replace({
        path: `/team/${teamMenuItems.value[0].key}`
      })
    }
  }
}

function handleMenuKeyChange(key: string) {
  const menu = getActiveMenuItem(key, menuItems.value) || null
  if (menu?.type === 'team') {
    router.push({
      path: `/${activeHeaderBarMenuKey.value}/${menu.key}`
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
  return key === sidebarKey.value && !props.isOutOfTeam ? 'menu-item active' : 'menu-item'
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
  loading.value = true
  const teams = await getTeams()
  teamMenuItems.value = teams.map(t => ({
    title: t.name,
    imageUrl: t.logo,
    key: t.id,
    type: 'team'
  }))
  genMenuItems()
  loading.value = false
}

async function initSidebarData() {
  await fetchUserTeams()
}

onMounted(() => {
  void initSidebarData()
  sidebarKey.value = 'home'
})

</script>

<style lang="scss">
.sidebar {
  background-color: $maskColor;
  width: 240px;
  height: calc(100vh - 92px - 1px);
  padding: 16px;
  padding-top: 24px;
  padding-bottom: 0;
  overflow-y: auto;

  .fake-data {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 24px;

    .avatar {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }

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
  }
}

.menu-item {
  width: calc(100% - 24px);
}
</style>