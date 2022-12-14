<template>
  <Modal :visible="props.visible" title="邀请成员" :width="500" :footer="null" @cancel="emit('close')" centered>
    <div class="invite-modal-container">
      <div class="invite-by-search">
        <div class="search-bar">
          <Input v-model:value="searchValue" placeholder="搜索用户昵称、手机号或邮箱" class="input" allow-clear
            @press-enter="handleSearchUsers()">
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
              <a v-else @click="handleMakeInviteLink(item.id)">邀请 TA</a>
            </div>
          </div>
        </div>
      </div>

      <div class="invite-by-link">
        <div>
          <div class="title flex-row">
            <LinkOutlined class="link" />
            生成链接邀请
            <Dropdown>
              <a class="select-time">
                <span>{{ (inviteLinkOutdateTime === TeamInviteLinkOutdateType.SEVEN_DAYS && '7 天内有效') ||
                    (inviteLinkOutdateTime === TeamInviteLinkOutdateType.NEVER && '永久有效')
                }}</span>
                <CaretDownFilled class="icon" />
              </a>
              <template #overlay>
                <Menu>
                  <MenuItem @click="inviteLinkOutdateTime = TeamInviteLinkOutdateType.SEVEN_DAYS">7 天内有效</MenuItem>
                  <MenuItem @click="inviteLinkOutdateTime = TeamInviteLinkOutdateType.NEVER">永久有效</MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </div>
          <div class="subtitle">收到链接的所有用户同意后将加入团队</div>
        </div>

        <Button type="primary" class="primary-btn" @click="handleMakeInviteLink()">生成并复制链接</Button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, defineProps } from 'vue'
import { LinkOutlined, SearchOutlined, CaretDownFilled } from '@ant-design/icons-vue'
import { searchUsers } from '@/apis/user'
import { User } from 'authing-js-sdk'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store'
import { createTeamInviteLink, TeamInviteLinkOutdateType } from '@/apis/team'
import { copyText } from '@/utils/clipboard'
import { message } from 'ant-design-vue'

const inviteLinkOutdateTime = ref<TeamInviteLinkOutdateType>(TeamInviteLinkOutdateType.SEVEN_DAYS)

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
  const inviteLink = await createTeamInviteLink(teamId, inviterUserId, inviteLinkOutdateTime.value, targetUserId)
  await copyText(inviteLink)
  message.success('已复制邀请链接')
}

</script>
<style lang="scss" scoped>
.select-time {
  display: flex;
  align-items: center;
  font-size: 13px;
  border-bottom: 1px solid #ddd;
  gap: 4px;
  font-weight: normal;
  margin-left: 8px;
  cursor: pointer;
  color: #333;
  line-height: 20px;

  .icon {
    font-size: 9px;
  }
}

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
      font-size: 14px;
      display: flex;
      align-items: center;
    }

    .subtitle {
      color: #666;
      font-size: 13px;
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