<template>
  <Dropdown v-model:visible="canvasScaleVisible">
    <div class="scale-seletor flex-row" @click="canvasScaleVisible = !canvasScaleVisible">
      <span class="text">{{ scaleText }}</span>
      <CaretDownFilled class="icon" />
    </div>
    <template #overlay>
      <Menu class="small-menu" @click="e => {
        e.domEvent.preventDefault()
      }">
        <MenuItem v-for="(val, key) in scaleOptionsMapper" :key="key" @click="handleChangeMode(key)">
        <div class="menu-between">
          <span>{{ val }}</span>
          <span></span>
        </div>
        </MenuItem>
        <MenuDivider />
        <MenuItem v-for="item in scaleNumberOptions" :key="item" @click="handleChangeMode(item)">
        {{ `${Number(item) * 100}%` }}
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>

</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { CaretDownFilled } from '@ant-design/icons-vue'
import { useDocsStore } from '@/store'
import { storeToRefs } from 'pinia'
const docsStore = useDocsStore()
const { pdfController } = storeToRefs(docsStore)

const canvasScaleVisible = ref(false)

const scaleOptionsMapper = {
  'auto': '自动缩放',
  'page-actual': '实际大小',
  'page-fit': '适应页面',
  'page-width': '适应页宽'
}

const scaleText = computed(() => {
  const val = pdfController.value?.scaleMode as string
  if (Number(val) > 0) {
    return `${Number(val) * 100}%`
  }
  return scaleOptionsMapper[val || 'auto']
})

function handleChangeMode(mode: string) {
  docsStore.updatePdfController({
    changedMode: mode
  })
  canvasScaleVisible.value = false
}

const scaleNumberOptions = computed(() => {
  if (!pdfController.value?.scaleModeList?.length) {
    return []
  }
  const list = pdfController.value.scaleModeList
  return list.filter(o => Number(o) > 0)
})

</script>
<style lang="scss">
.small-menu {
  user-select: none;
  width: 200px;

  .menu-between {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &> :last-child {
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
  width: 100px;
  justify-content: space-between;
  font-size: 13px;
  letter-spacing: 0.5px;

  .icon {
    font-size: 12px;
  }
}
</style>