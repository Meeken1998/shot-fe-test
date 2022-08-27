<template>
  <Dropdown v-model:visible="canvasScaleVisible">
    <div class="scale-seletor flex-row" @click="canvasScaleVisible = !canvasScaleVisible">
      <span class="text">{{ canvasScalePercentage }}</span>
      <CaretDownFilled class="icon" />
    </div>
    <template #overlay>
      <Menu @click.prevent class="small-menu">
        <MenuItem @click="resetCanvas()">
        <div class="menu-between">
          <span>适应屏幕</span>
          <span>⌘ + 0</span>
        </div>
        </MenuItem>
        <MenuDivider />
        <MenuItem v-for="item in canvasScalePresetList" :key="item" @click="applyCanvasPresetScale(item)">
        {{ item }}%
        </MenuItem>
        <MenuDivider />
        <MenuItem @click="scaleCanvas('-')">
        <div class="menu-between">
          <span>缩小</span>
          <span>-</span>
        </div>
        </MenuItem>
        <MenuItem @click="scaleCanvas('+')">
        <div class="menu-between">
          <span>放大</span>
          <span>+</span>
        </div>
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>

</template>
<script lang="ts" setup>
import { ref } from 'vue'
import useScaleCanvas from '@/hooks/useScaleCanvas'
import { CaretDownFilled } from '@ant-design/icons-vue'
const canvasScalePresetList = [200, 150, 100, 80, 50]

const canvasScaleVisible = ref(false)
const {
  scaleCanvas,
  setCanvasScalePercentage,
  resetCanvas,
  canvasScalePercentage,
} = useScaleCanvas()

const applyCanvasPresetScale = (value: number) => {
  setCanvasScalePercentage(value)
  canvasScaleVisible.value = false
}
</script>
<style lang="scss">
.small-menu {
  user-select: none;
  width: 200px;

  .menu-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    & > :last-child {
      opacity: 0.5;
    }
  }

  .ant-dropdown-menu-title-content {
    font-size: 13px !important;
  }

  .ant-dropdown-menu-item {
    margin: 6px;
    padding: 4px 12px;
    border-radius: 3px;
    padding-left: 24px;
  }
}

.scale-seletor {
  background-color: #ebebeb;
  padding: 8px 12px;
  border-radius: $borderRadius;
  margin-right: 24px;
  width: 84px;
  justify-content: space-between;
  font-size: 13px;
  letter-spacing: 0.5px;

  .icon {
    font-size: 12px;
  }
}
</style>