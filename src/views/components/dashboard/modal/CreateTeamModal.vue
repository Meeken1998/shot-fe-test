<template>
  <Modal :visible="props.visible" centered :footer="null" :width="550" class="create-team-modal" :closable="false">
    <div class="wrapper">
      <div class="left">
        <div class="title">创建新团队</div>
        <div class="subtitle" :style="{ marginBottom: '36px' }">与团队成员一同协作</div>

        <div class="form">
          <div class="item">
            <div class="title">团队名称</div>
            <div class="box">
              <Input class="input" placeholder="请输入团队名称" v-model:value="name" />
            </div>
          </div>
          <div class="item">
            <div class="title">团队描述（可选）</div>
            <div class="box">
              <TextArea class="input textarea" placeholder="请输入团队描述" v-model:value="description" />
            </div>
          </div>
          <div class="item">
            <div class="title">LOGO（可选）</div>
            <div class="box">
              <UploadImage @change="url => logoUrl = url" :init-file-list="logoUrl ? [logoUrl] : undefined" />
            </div>
          </div>
        </div>

        <div class="buttons">
          <Button type="primary" class="primary-btn-large" @click="handleCreateTeam()">创建团队</Button>
          <Button class="primary-btn-large" @click="emit('close')">取消</Button>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue'
import UploadImage from '@/components/UploadImage.vue'
import { CreateTeamPayload } from '@/apis/team'
import { message } from 'ant-design-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    require: true
  }
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'ok', options: CreateTeamPayload): void
}>()

const name = ref('')
const description = ref('')
const logoUrl = ref('')

watch([
  () => props.visible
], () => {
  name.value = ''
  description.value = ''
  logoUrl.value = ''
})

function handleCreateTeam() {
  if (!name.value) {
    void message.warning('请输入团队名称')
    return
  }
  emit('ok', {
    name: name.value,
    description: description.value,
    logoUrl: logoUrl.value
  })
}

</script>
<style lang="scss">
.create-team-modal {
  .input {
    font-size: 14px;
  }

  .ant-modal-body {
    padding: 0;
    overflow: hidden;
  }

  .ant-modal-content {
    overflow: hidden;
    border-radius: 2 * $borderRadius  !important;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
  }

  .subtitle {
    color: #666;
  }

  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;

    .right {
      flex: 1;
    }

    .left {
      flex: 1;
      padding: 36px;
      height: 600px;
    }
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .item {
      width: 100%;

      .title {
        font-size: 13px;
        color: #666;
        margin-bottom: 6px;
      }
    }
  }

  .bg-photo {
    background-image: url('https://static.aside.fun/upload/tYA4lk.jpg');
    width: 100%;
    height: 600px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
  }

  .buttons {
    display: flex;
    gap: 16px;
    margin-top: 36px;
  }

  .textarea {
    height: 80px;
    resize: none;
  }
}
</style>