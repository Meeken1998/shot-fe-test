<template>
  <Modal :visible="props.visible" title="邀请成员" :width="500" :footer="null" @cancel="emit('close')" centered>
    <div class="invite-modal-container">
      <div class="invite-by-search">
        <div class="search-bar">
          <Input v-model:value="searchValue" placeholder="搜索用户昵称、手机号或邮箱" class="input" allow-clear @press-enter="handleSearchUsers()">
          <template #prefix>
            <SearchOutlined />
          </template>
          </Input>
          <Button type="primary" :disabled="!searchValue" @click="handleSearchUsers()">搜索</Button>
        </div>

        <div class="searched-users">
          <div class="user" v-for="(item) in searchedUsersList" :key="item.id">
            <div class="userinfo">
              <Avatar :size="24" :src="item.photo || ''" :draggable="false" />
              <div class="content">
                <span class="name">{{ item.name || item.nickname || item.phone || item.email }}</span>
              </div>
            </div>

            <div class="role">
              <div v-if="user?.sub === item.id" class="me">我</div>
              <a v-else @click="handleMakeInviteLink(item.id)">邀请</a>
            </div>
          </div>
        </div>
      </div>

      <div class="invite-by-link">
        <div>
          <div class="title">
            <LinkOutlined class="link" />
            使用链接邀请
          </div>
          <div class="subtitle">成员同意后将加入团队</div>
        </div>

        <Button type="primary" class="primary-btn" @click="handleMakeInviteLink()">复制链接</Button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import { LinkOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { searchUsers } from '@/apis/user'
import { User } from 'authing-js-sdk'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store'
import { createTeamInviteLink } from '@/apis/team'
import { copyText } from '@/utils/clipboard'
import { message } from 'ant-design-vue'

const searchValue = ref('')
const searchedUsersList = ref<User[]>([])

const { user } = storeToRefs(useDashboardStore())

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  teamId: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

async function handleSearchUsers() {
  const users = await searchUsers(searchValue.value)
  searchedUsersList.value = users
}

async function handleMakeInviteLink(targetUserId?: string) {
  // 如果没有传 userId，则生成公共的邀请链接，否则是一对一的
  const teamId = props.teamId
  const inviterUserId = user.value?.sub || ''
  const inviteLink = await createTeamInviteLink(teamId, inviterUserId, targetUserId)
  await copyText(inviteLink)
  message.success('已复制邀请链接')
}

</script>
<style lang="scss" scoped>
.invite-modal-container {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .invite-by-search {
    width: 100%;

    .search-bar {
      display: flex;
      align-items: center;
      gap: 12px;

      button {
        flex-shrink: 0;
      }
    }
  }

  .invite-by-link {
    width: 100%;
    flex-shrink: 0;
    line-height: 1.8;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-weight: bold;
      font-size: 16px;
    }

    .subtitle {
      color: #666;
    }
  }
}

.link {
  color: $themeColor;
  margin-right: 4px;
}

.searched-users {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  height: 290px;
  overflow-y: auto;
}

.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
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
      gap: 8px;

      .name {
        font-size: 12px;
      }
    }
  }
}

.me {
  color: #888;
}
</style>