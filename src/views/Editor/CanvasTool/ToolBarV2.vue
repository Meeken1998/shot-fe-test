<template>
  <div class="toolbar-v2">
    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="撤销">
      <div class="tool-btn" @click="undo()">
        <img src="https://static.aside.fun/upload/undo.svg" class="icon" :draggable="false" />
        <span>撤销</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="重做">
      <div class="tool-btn" @click="redo()">
        <img src="https://static.aside.fun/upload/remake.svg" class="icon" :draggable="false" />
        <span>重做</span>
      </div>
    </Tooltip>

    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入文字">
      <div class="tool-btn" @click="drawText()">
        <img src="https://static.aside.fun/upload/remake.svg" class="icon" :draggable="false" />
        <span>文字</span>
      </div>
    </Tooltip>

    <FileInput @change="(files: any) => insertImageElement(files)">
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入图片">
        <div class="tool-btn">
          <img src="https://static.aside.fun/upload/image.svg" class="icon" :draggable="false" />
          <span>图片</span>
        </div>
      </Tooltip>
    </FileInput>

    <Popover trigger="click" v-model:visible="shapePoolVisible">
      <template #content>
        <ShapePool @select="shape => drawShape(shape)" />
      </template>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入形状">
        <div class="tool-btn">
          <img src="https://static.aside.fun/upload/shape.svg" class="icon" :draggable="false" />
          <span>形状</span>
        </div>
      </Tooltip>
    </Popover>

    <Popover trigger="click" v-model:visible="linePoolVisible">
      <template #content>
        <LinePool @select="line => drawLine(line)" />
      </template>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入线条">
        <div class="tool-btn">
          <img src="https://static.aside.fun/upload/line.svg" class="icon" :draggable="false" />
          <span>线条</span>
        </div>
      </Tooltip>
    </Popover>

    <Popover trigger="click" v-model:visible="chartPoolVisible">
      <template #content>
        <ChartPool @select="chart => { createChartElement(chart); chartPoolVisible = false }" />
      </template>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入图表">
        <div class="tool-btn">
          <img src="https://static.aside.fun/upload/grid.svg" class="icon" :draggable="false" />
          <span>图表</span>
        </div>
      </Tooltip>
    </Popover>

    <Popover trigger="click" v-model:visible="tableGeneratorVisible">
      <template #content>
        <TableGenerator @close="tableGeneratorVisible = false"
          @insert="({ row, col }) => { createTableElement(row, col); tableGeneratorVisible = false }" />
      </template>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入表格">
        <div class="tool-btn">
          <img src="https://static.aside.fun/upload/table.svg" class="icon" :draggable="false" />
          <span>表格</span>
        </div>
      </Tooltip>
    </Popover>


    <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入公式">
      <div class="tool-btn" @click="latexEditorVisible = true">
        <img src="https://static.aside.fun/upload/formula.svg" class="icon" :draggable="false" />
        <span>公式</span>
      </div>
    </Tooltip>

    <Popover trigger="click" v-model:visible="mediaInputVisible">
      <template #content>
        <MediaInput @close="mediaInputVisible = false"
          @insertVideo="src => { createVideoElement(src); mediaInputVisible = false }"
          @insertAudio="src => { createAudioElement(src); mediaInputVisible = false }" />
      </template>
      <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.5" title="插入富媒体">
        <div class="tool-btn">
          <img src="https://static.aside.fun/upload/media.svg" class="icon" :draggable="false" />
          <span>媒体</span>
        </div>
      </Tooltip>
    </Popover>
  </div>

  <Modal v-model:visible="latexEditorVisible" :footer="null" centered :width="880" destroyOnClose>
    <LaTeXEditor @close="latexEditorVisible = false"
      @update="data => { createLatexElement(data); latexEditorVisible = false }" />
  </Modal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'
import { useMainStore } from '@/store'
import { getImageDataURL } from '@/utils/image'
import useCreateElement from '@/hooks/useCreateElement'
import ShapePool from './ShapePool.vue'
import { ShapePoolItem } from '@/configs/shapes'
import { LinePoolItem } from '@/configs/lines'
import LinePool from './LinePool.vue'
import ChartPool from './ChartPool.vue'
import TableGenerator from './TableGenerator.vue'
import MediaInput from './MediaInput.vue'
import LaTeXEditor from '@/components/LaTeXEditor/index.vue'

const shapePoolVisible = ref(false)
const linePoolVisible = ref(false)
const chartPoolVisible = ref(false)
const latexEditorVisible = ref(false)
const mediaInputVisible = ref(false)

const tableGeneratorVisible = ref(false)

const mainStore = useMainStore()

const { redo, undo } = useHistorySnapshot()

// 绘制文字范围
const drawText = () => {
  mainStore.setCreatingElement({
    type: 'text',
  })
}

const drawLine = (line: LinePoolItem) => {
  mainStore.setCreatingElement({
    type: 'line',
    data: line,
  })
  linePoolVisible.value = false
}

const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
} = useCreateElement()

const insertImageElement = (files: FileList) => {
  const imageFile = files[0]
  if (!imageFile) return
  getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
}

const drawShape = (shape: ShapePoolItem) => {
  mainStore.setCreatingElement({
    type: 'shape',
    data: shape,
  })
  shapePoolVisible.value = false
}

</script>
<style lang="scss" scoped>
.toolbar-v2 {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .tool-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: 1px;
    user-select: none;
    padding: 12px;
    border-radius: $borderRadius;
    transition: all .3s;

    &:hover {
      background-color: #f9f9f9;
    }

    .icon {
      width: 18px;
      height: 18px;
    }

    &:nth-child(2) {
      // 重做
      margin-right: 24px;
    }
  }

}
</style>