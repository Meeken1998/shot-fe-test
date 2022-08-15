<template>
  <div class="homepage">
    <div class="group-info">
      <div class="title">首页</div>
      <div class="buttons">
        <Button class="primary-btn">导入文件</Button>
        <router-link :to="{ name: 'editor' }" target="_blank">
          <Button type="primary" class="primary-btn">新建</Button>
        </router-link>
      </div>
    </div>

    <div class="group">
      <div class="title-bar">
        <h1 :style="{ marginBottom: '16px' }">最近访问</h1>

        <ProjectWrapper :items="[item]" />
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import ProjectWrapper from '@/views/components/project/ProjectWrapper.vue'
import { ProjectItem } from '@/types/project'
import { onMounted } from 'vue'

const item: ProjectItem = {
  title: '哈哈哈',
  id: '111',
  cover: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.1ppt.com%2Fuploads%2Fallimg%2F2101%2F1_210117170406_1.jpg&refer=http%3A%2F%2Fimg.1ppt.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662995600&t=785c41813f7598c6ace873d03624a921',
  updateTimestamp: 1660403604521,
  type: 1
}

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