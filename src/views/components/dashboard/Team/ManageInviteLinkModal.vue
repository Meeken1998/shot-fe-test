<template>
  <Modal :visible="visible" title="邀请链接管理" :width="640" :footer="null" centered @cancel="emit('close')"
    class="manage-invite-link-modal">
    <div class="flex-row" style="gap: 16px;padding: 16px 0;margin-top: -20px;">
      <Select placeholder="请选择链接状态" :style="{ width: '160px' }" v-model:value="filterStatus">
        <SelectOption value="all">全部状态</SelectOption>
        <SelectOption value="pass">已通过</SelectOption>
        <SelectOption value="effective">生效中</SelectOption>
        <SelectOption value="pause">暂停使用</SelectOption>
        <SelectOption value="expired">已失效</SelectOption>
      </Select>

      <Select placeholder="请选择有效期" :style="{ width: '160px' }" v-model:value="filterExpireTime">
        <SelectOption value="all">全部有效期</SelectOption>
        <SelectOption value="forever">永久有效</SelectOption>
        <SelectOption value="7days">7 天内有效</SelectOption>
      </Select>
    </div>

    <div class="links">
      <div v-if="!loaded" style="margin-left: 12px; margin-top: 12px;">
        <Skeleton width="70%" height="20px"></Skeleton>
        <div style="margin-top: 12px">
          <Skeleton width="40%" height="16px"></Skeleton>
        </div>
        <div style="margin-top: 4px">
          <Skeleton width="40%" height="16px"></Skeleton>
        </div>
      </div>
      <div v-else v-for="(item) in (filterData || invites)" :key="item._id" class="link">
        <div class="left">
          <div class="flex-row">
            <Tooltip v-if="(item.outdateTimestamp > 0 && item.outdateTimestamp < Date.now())" title="已失效">
              <StopFilled class="disabled" />
            </Tooltip>
            <Tooltip v-else-if="item.status === TeamInviteStatus.EFFECTIVE" title="生效中">
              <ClockCircleFilled class="info" />
            </Tooltip>
            <Tooltip v-if="item.status === TeamInviteStatus.DISABLED" title="暂停使用">
              <PauseCircleFilled class="warning" />
            </Tooltip>
            <Tooltip v-if="item.targetUser && item.acceptedUserIds?.length" title="已通过">
              <CheckCircleFilled class="success" />
            </Tooltip>
            <span class="title">
              <span>{{ item?.remark || '未命名邀请链接' }}</span>
              <Popconfirm ok-text="确认" cancel-text="取消" placement="topLeft" @visible-change="remark = item.remark || ''"
                :ok-button-props="{
                  disabled: !remark
                }" @confirm="handleUpdateRemark(item._id)">
                <template #icon>
                  <div style="margin-bottom: 8px">备注：</div>
                </template>
                <template #title>
                  <Input placeholder="仅团队内部可见（限16字）" style="width: 240px;" :maxlength="16" v-model:value="remark" />
                </template>
                <EditOutlined class="edit-icon" />
              </Popconfirm>

              <CopyOutlined class="edit-icon" @click="handleCopyLink(item)"></CopyOutlined>
            </span>
          </div>

          <div class="flex-row avatars" style="margin-top: 16px">
            <span class="tips">受邀者：{{ !item.targetUser && !item.acceptedUsers?.length ? '暂无' : '' }}</span>
            <AvatarGroup :max-count="4" :size="24" :max-style="{ fontSize: '9px' }">
              <Tooltip v-if="item?.targetUser">
                <template #title>
                  <div>用户：{{ getName(item.targetUser) }}</div>
                  <div>状态：{{ acceptedUserIds.includes(item.targetUser?.id!) ? '已接受' : '未接受' }}</div>
                </template>
                <Avatar :src="item.targetUser.photo!" :class="{
                  'no-accept': !acceptedUserIds.includes(item.targetUser.id!)
                }" />
              </Tooltip>
              <Tooltip v-else v-for="(usr) in item.acceptedUsers" :key="usr.id">
                <template #title>
                  <div>用户：{{ getName(usr) }}</div>
                  <div>状态：{{ acceptedUserIds.includes(usr.id!) ? '已接受' : '未接受' }}</div>
                </template>
                <Avatar :src="usr.photo!" :class="{
                  'no-accept': !acceptedUserIds.includes(usr.id!)
                }" />
              </Tooltip>
            </AvatarGroup>
          </div>

          <div class="flex-row avatars" style="margin-top: 8px">
            <span class="tips">创建者：</span>
            <Tooltip>
              <template #title>
                <div>用户：{{ getName(item.inviterUser) }}</div>
              </template>
              <Avatar :src="item.inviterUser?.photo!" :size="22" />
            </Tooltip>
          </div>
        </div>

        <div class="right">
          <span class="expired">创建于 {{ getDateDiff(item.createdTimestamp) }}， {{ getLinkTimeTips(item) }}</span>
          <Dropdown>
            <div class="flex-row action">操作
              <CaretDownFilled style="margin-left: 4px" />
            </div>
            <template #overlay>
              <Menu>
                <MenuItem v-if="item.outdateTimestamp === 0" @click="handlePauseLink(item)">{{ item.status ===
                    TeamInviteStatus.DISABLED ? '开启' : '暂停'
                }}使用</MenuItem>
                <MenuItem @click="handleDeleteLink(item)">
                <span style="color: red">删除</span>
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </div>

      <Empty v-if="loaded && !(filterData || invites).length" style="margin-top: 200px"></Empty>
    </div>

  </Modal>
</template>
<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import { CheckCircleFilled, PauseCircleFilled, ClockCircleFilled, CaretDownFilled, StopFilled, EditOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { getTeamInvites, TeamInviteWithUserProfile, TeamInviteStatus, updateTeamInviteRemark, toggleTeamInviteStatus, deleteTeamInvite } from '@/apis/team'
import { getDateDiff } from '@/utils/time'
import { getName } from '@/utils/authing'
import { message, Modal, Popconfirm } from 'ant-design-vue'
import { copyText } from '@/utils/clipboard'

const invites = ref<TeamInviteWithUserProfile[]>([])
const acceptedUserIds = ref<string[]>([])

const filterStatus = ref('all')
const filterExpireTime = ref('all')
const filterData = ref<TeamInviteWithUserProfile[]>()
const remark = ref('')
const loaded = ref(false)

async function handleUpdateRemark(inviteId: string) {
  const res = await updateTeamInviteRemark(props.teamId, inviteId, remark.value)
  if (res) {
    void message.success('修改备注成功')
    const idx = invites.value.findIndex(i => i._id === inviteId)
    const newVal = invites.value.slice()
    newVal[idx].remark = remark.value
    invites.value = newVal
    getFilterData()
  }
  else {
    void message.warning('修改备注失败')
  }
}

function getLinkTimeTips(item: TeamInviteWithUserProfile) {
  const { outdateTimestamp: timestamp } = item
  if (timestamp === 0) {
    return '永久有效'
  }
  if (timestamp < Date.now()) {
    return '已失效'
  }
  if (item.status === TeamInviteStatus.ACCEPTED) {
    return '对方通过邀请'
  }
  return getDateDiff(timestamp) + '失效'
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  teamId: {
    type: String,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

async function getData() {
  loaded.value = false
  const res = await getTeamInvites(props.teamId)
  const acceptIds = res.map(r => r.acceptedUserIds || []).flat()
  acceptedUserIds.value = acceptIds
  invites.value = res
  loaded.value = true
}

watch(() => [props.visible, props.teamId], ([visible]) => {
  if (visible) {
    filterExpireTime.value = 'all'
    filterStatus.value = 'all'
    getData().then(() => getFilterData())
  }
})

watch(() => [filterExpireTime.value, filterStatus.value], getFilterData)

function getFilterData() {
  const [time, status] = [filterExpireTime.value, filterStatus.value]
  let _filterData = invites.value.slice()
  if (time !== 'all') {
    _filterData = _filterData.filter(i => {
      return time === '7days' ? i.outdateTimestamp : !i.outdateTimestamp
    })
  }
  if (status !== 'all') {
    if (status === 'pass') _filterData = _filterData.filter(i => i.targetUserId && i.acceptedUserIds.includes(i.targetUserId))
    if (status === 'effective') _filterData = _filterData.filter(i => i.status === TeamInviteStatus.EFFECTIVE)
    if (status === 'pause') _filterData = _filterData.filter(i => i.status === TeamInviteStatus.DISABLED)
    if (status === 'expired') _filterData = _filterData.filter(i => i.outdateTimestamp > 0 && i.outdateTimestamp < Date.now())
  }
  filterData.value = _filterData
}

function handlePauseLink(invite: TeamInviteWithUserProfile) {
  Modal.confirm({
    title: '提示',
    centered: true,
    content: `是否确认${invite.status === TeamInviteStatus.DISABLED ? '开启' : '暂停'}使用邀请链接「${invite.remark || '未命名邀请链接'}」`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      const res = await toggleTeamInviteStatus(props.teamId, invite._id)
      if (res) {
        void message.success('成功')
        await getData()
        getFilterData()
      }
    }
  })
}

function handleDeleteLink(invite: TeamInviteWithUserProfile) {
  Modal.confirm({
    title: '提示',
    centered: true,
    content: `是否确认删除邀请链接「${invite.remark || '未命名邀请链接'}」，删除后，任何用户无法通过该链接加入团队，该操作不可恢复`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      const res = await deleteTeamInvite(props.teamId, invite._id)
      if (res) {
        void message.success('成功')
        await getData()
        getFilterData()
      }
    }
  })
}

function handleCopyLink(invite: TeamInviteWithUserProfile) {
  copyText(`${location.origin}/join-team/${invite._id}`)
  void message.success('已复制邀请链接')
}
</script>
<style lang="scss" scoped>
.manage-invite-link-modal {
  .ant-modal-body {
    padding: 12px;
    padding-top: 0;
  }

  .no-accept {
    opacity: 0.5;
  }

  .edit-icon {
    cursor: pointer;
    color: $grayColor;
    margin-left: 8px;
    font-size: 12px;
  }

  .success {
    color: $successColor;
  }

  .warning {
    color: $warningColor;
  }

  .disabled {
    color: $grayColor;
  }

  .info {
    color: $infoColor;
  }

  .links {
    width: 100%;
    user-select: none;
    height: 600px;
    overflow-y: auto;

    .link {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
      margin: 0 12px;

      .left {
        .title {
          font-weight: bold;
          margin-left: 8px;
          font-size: 14px;
        }

        .avatars {
          .tips {
            font-size: 13px;
            color: $grayColor;
          }
        }
      }

      .right {
        display: flex;
        align-items: center;
        gap: 16px;
        font-size: 13px;

        .expired {
          color: $grayColor;
        }

        .action {
          cursor: pointer;
        }
      }
    }
  }
}
</style>