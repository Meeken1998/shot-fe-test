<template>
  <div v-if="!_isPC" class="mobile-tips">
    <svg t="1664257011339" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="8261" width="120" height="120" data-spm-anchor-id="a313x.7781069.0.i4">
      <path
        d="M671.744 789.504q0 11.264-6.656 20.48t-18.944 9.216l-243.712-1.024q-11.264 1.024-17.92-9.216t-6.656-19.456q0-8.192 6.144-18.432t18.432-10.24l75.776 0 0-64.512-340.992 0q-33.792 0-54.784-18.944t-20.992-51.712l0-508.928q0-32.768 19.968-49.152t52.736-16.384l755.712 0q32.768 0 52.224 17.92t19.456 47.616l0 508.928q0 31.744-17.92 49.664t-53.76 17.92l-318.464 0 0 68.608 73.728 0q11.264 0 18.944 8.704t7.68 18.944zM890.88 163.84l-768 0 0 359.424 768 0 0-359.424zM566.272 566.272l-87.04 0 0 77.824 87.04 0 0-77.824z"
        p-id="8262" data-spm-anchor-id="a313x.7781069.0.i1" class="" fill="#dbdbdb"></path>
    </svg>

    <div class="tips">
      <div>为了更好的体验</div>
      <div>请使用 PC 端访问本页面</div>
    </div>
    <Button class="primary-btn" style="margin-top: 12px;" @click="handleCopyLink()">复制本页链接</Button>
  </div>
</template>
<script lang="ts" setup>
import { copyText } from '@/utils/clipboard'
import { isPC } from '@/utils/common'
import { message } from 'ant-design-vue'
const _isPC = isPC()

function handleCopyLink() {
  copyText(location.href)
  void message.success('复制成功')
}

</script>
<style lang="scss" scoped>
.mobile-tips {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  top: 0;

  .tips {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.5;
    color: $themeColor;
    text-align: center;
    margin: 16px 0;
  }
}
</style>