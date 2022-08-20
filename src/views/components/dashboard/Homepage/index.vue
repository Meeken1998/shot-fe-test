<template>
  <div class="homepage">
    <div class="group-info">
      <div class="title">首页</div>
      <div class="buttons">
        <UploadWrapper :team-id="defaultTeamId!">
          <Button class="primary-btn">导入文件</Button>
        </UploadWrapper>
        <router-link :to="{ path: `/createDocs`, query: { teamId: defaultTeamId } }" target="_blank">
          <Button type="primary" class="primary-btn">新建</Button>
        </router-link>
      </div>
    </div>

    <div class="group">
      <div class="title-bar">
        <h1 :style="{ marginBottom: '16px' }">最近访问</h1>

        <ProjectWrapper :items="[]" />
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { useDashboardStore } from '@/store'
import ProjectWrapper from '@/views/components/project/ProjectWrapper.vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import UploadWrapper from '../../widget/UploadWrapper.vue'

const defaultTeamId = computed(() => menuItems.value['teamMenuItems']?.[0]?.key)

const { menuItems } = storeToRefs(useDashboardStore())

async function getData() {
  //
}

onMounted(() => {
  void getData()
})

</script>
<style lang="scss">
.homepage {
  width: 100%;

  .group {
    width: 100%;
    margin-top: 32px;
  }

  .group-info {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .buttons {
      display: flex;
      gap: 16px;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
    }
  }
}

.cover-radius {
  border-radius: $borderRadius;
  height: 36px;
}

.userinfo {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}

.user-dropdown {
  width: 200px;
  font-weight: bold;
  user-select: none;
}

.ant-dropdown-menu {
  margin-top: 4px;
}

.disabled-menu {
  &:hover {
    background-color: inherit !important;
  }
}
</style>