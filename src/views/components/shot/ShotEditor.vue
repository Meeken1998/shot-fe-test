<template>
  <div class="editor-view">
    <div v-for="item in slides" :key="item.id" class="editor-container">
      <div class="editor" :id="`slide_${item.id}`"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import EditorJS from '@editorjs/editorjs'
import { getConfigs } from '@/utils/shotEditor/config'
import { useMainStore, useSlidesStore } from '@/store'
import { storeToRefs } from 'pinia'
const slidesStore = useSlidesStore()

const { slides } = storeToRefs(slidesStore)
const mainStore = useMainStore()
let editors: Record<string, EditorJS> = {}

function initEditors() {
  editors = {}
  mainStore.setDisableHotkeysState(true)
  const _slides = slides.value.slice()
  _slides.forEach((item) => {
    const id = `slide_${item.id}`
    const el = document.querySelector('#' + id)
    const ed = new EditorJS(getConfigs(el as HTMLElement))
    editors[item.id] = ed
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.editors = editors
}

onMounted(() => {
  initEditors()
})
</script>
<style lang="scss">
ol,
ul,
li {
  list-style: unset;
}
@import './codex.css';
.editor-view {
  width: 100%;
  height: calc(100vh - 85px);
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  gap: 24px;
  font: unset;

  .editor-container {
    width: 800px;
    padding: 24px;
    background-color: #fff;
    box-shadow: 0px 1px 4px 0 rgb(0 0 0 / 10%);

    &:first-child {
      margin-top: 48px;
    }

    &:last-child {
      margin-bottom: 48px;
    }
  }

  .codex-editor__redactor {
    padding-bottom: unset !important;
    min-height: 400px;
  }
}
</style>
