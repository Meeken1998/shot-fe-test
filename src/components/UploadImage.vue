<template>
  <Upload @change="handleChange" :custom-request="customRequest" :file-list="fileList" :max-count="1">
    <div v-if="fileList.length" class="preview">
      <img :src="fileList[0]?.url" draggable="false" />
    </div>

    <div v-else class="preview">
      <PlusOutlined />
    </div>

    <template #itemRender></template>
  </Upload>
</template>
<script lang="ts" setup>
import useQiniuUpload from '@/hooks/useQiniuUpload'
import { UploadChangeParam, UploadFile } from 'ant-design-vue'
import { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface'
import { ref, defineProps, PropType, onMounted } from 'vue'
import * as qiniu from 'qiniu-js'
import { PlusOutlined } from '@ant-design/icons-vue'

const props = defineProps({
  initFileList: {
    type: Array as PropType<string[]>,
    require: false
  }
})

onMounted(() => {
  if (props.initFileList?.length) {
    fileList.value = props.initFileList.map(s => ({
      fileName: s,
      uid: s,
      name: s,
      url: s,
    }))
  }
})

const { getToken } = useQiniuUpload()

const emit = defineEmits<
  (event: 'change', url: string) => void
>()

const fileList = ref<UploadFile<any>[]>([])

async function customRequest(options: UploadRequestOption<any>) {
  const { file, onSuccess, onProgress, onError } = options
  const fileKey = `/shot/${(file as File).name}`
  const token = await getToken()
  const observable = qiniu.upload(file as File, fileKey, token)
  observable.subscribe({
    next: (res: any) => {
      const { percent } = (res?.total || {}) as Record<string, number>
      onProgress?.({
        percent
      })
    },
    error: (err: any) => {
      onError?.(err)
    },
    complete: (res: Record<string, string>) => {
      const { hash, key } = res
      const name = (file as File).name
      const imageUrl = `https://static.aside.fun/${key}`

      onSuccess?.(imageUrl)
      fileList.value = [{
        fileName: name,
        uid: hash,
        name,
        url: imageUrl
      }]
      emit('change', imageUrl)
    }
  })
}

function handleChange(info: UploadChangeParam<UploadFile<any>>) {
  if (info.file.status !== 'uploading') {
    fileList.value = info.fileList
  }
}


</script>
<style lang="scss" scoped>
.preview {
  width: 100px;
  height: 100px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: $borderRadius;
  overflow: hidden;
  border: 1px solid #e5e5e5;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>