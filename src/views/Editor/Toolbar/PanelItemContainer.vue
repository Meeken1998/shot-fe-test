<template>
  <div class="panel-item-container" :style="hasDivider ? { borderColor: '#eee' } : {}">
    <div class="bar" @click="handleExpandClick()">
      <div class="title">{{ title }}</div>
      <div class="expand-button">
        <PlusOutlined v-if="control ? !expand : !isExpand" />
        <MinusOutlined v-else />
      </div>
    </div>
    <div class="content" v-if="control ? expand : isExpand">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
const isExpand = ref(false)
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultExpand: {
    type: Boolean,
    required: false,
    default: false
  },
  hasDivider: {
    type: Boolean,
    required: false,
    default: true
  },
  control: {
    type: Boolean,
    required: false,
    default: false
  },
  expand: {
    type: Boolean,
    required: false,
    default: false
  }
})

onMounted(() => {
  isExpand.value = props.defaultExpand
})

const emit = defineEmits<{
  (event: 'onexpand'): void
}>()

function handleExpandClick() {
  if (!props.control) {
    isExpand.value = !isExpand.value
  }
  else {
    emit('onexpand')
  }
}
</script>
<style lang="scss" scoped>
.panel-item-container {
  width: 100%;
  border-bottom: 1px solid transparent;
  margin-bottom: 16px;
  .bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 16px;
    user-select: none;

    .title {
      font-weight: bold;
    }

    .expand-button {
      padding: 8px;
      font-size: 12px;
      transition: all .3s;
      border-radius: 4px;

      &:hover {
        background-color: #f7f7f7;
      }
    }
  }

  .content {
    width: 100%;
    margin-top: -4px;
    margin-bottom: 16px;
  }
}
</style>