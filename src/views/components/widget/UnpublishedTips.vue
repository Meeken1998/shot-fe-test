<template>
  <div class="unpublished-page page-container">
    <img class="tips-img" src="https://static.aside.fun/upload/unpublished.png" :draggable="false" @load="loading = false" />
    <div class="tips">即将上线，敬请期待！</div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const loading = ref(true)
</script>
<style lang="scss" scoped>
.unpublished-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: $themeColor;
  font-weight: bold;

  .tips-img {
    width: 500px;
    height: 400px;
    transform: scale(0.8);
  }

  .tips {
    font-size: 20px;
    margin-top: 48px;
  }
}
</style>