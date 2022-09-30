<template>
  <Modal :visible="visible" :title="title" :width="500" :footer="null" @cancel="emit('close')" centered>
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
          <div class="user" v-for="(item) in searchedUsersList" :key="item.id" @click="handleCheckboxClick(item.id)">
            <div class="userinfo">
              <Avatar :size="24" :src="item.photo || ''" :draggable="false" />
              <div class="content">
                <span class="name">{{ item.name || item.nickname || item.phone || item.email }}</span>
              </div>
            </div>

            <div class="role">
              <Checkbox :checked="selectedUserIds.includes(item.id)" :disabled="item.id === user?.sub" />
            </div>
          </div>
        </div>
      </div>

      <div class="toolset">
        <div class="selected-tips">
          {{ selectedUserIds.length ? `已选择 ${selectedUserIds.length} 人` : '' }}
        </div>
        <Button class="primary-btn" type="primary" @click="handleOk()">确定</Button>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, defineProps, PropType, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { searchUsers } from '@/apis/user'
import { User } from 'authing-js-sdk'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/store'
import { message } from 'ant-design-vue'

const searchValue = ref('')
const searchedUsersList = ref<User[]>([])
const selectedUserIds = ref<string[]>([])

const { user } = storeToRefs(useDashboardStore())

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: false,
    default: '邀请成员'
  },
  initSelectedUserIds: {
    type: Array as PropType<Array<string>>,
    required: false,
  }
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'ok', userIds: string[]): void
}>()

watch(() => props.initSelectedUserIds, ids => {
  if (ids) {
    selectedUserIds.value = ids
  }
})

async function handleSearchUsers() {
  console.log(searchValue.value)
  const users = await searchUsers(searchValue.value)
  searchedUsersList.value = users
}

function handleCheckboxClick(id: string) {
  if (user.value?.sub === id) {
    void message.warn('无法邀请自己')
    return
  }
  if (selectedUserIds.value.includes(id)) {
    selectedUserIds.value = selectedUserIds.value.filter(uid => uid !== id)
  }
  else {
    selectedUserIds.value = [...selectedUserIds.value, id]
  }
}

function handleOk() {
  if (!selectedUserIds.value.length) {
    void message.warn('至少选择一名用户')
    return
  }
  emit('ok', selectedUserIds.value)
}

</script>
<style lang="scss" scoped>
.toolset {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .selected-tips {
    font-size: 12px;
    color: $grayColor;
  }
}

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
  overflow-y: auto;
  height: 304px;
}

.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  padding-right: 8px;
  border-bottom: 1px solid #f0f0f0;
  user-select: none;

  &:hover {
    background-color: #fafafa;
  }

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