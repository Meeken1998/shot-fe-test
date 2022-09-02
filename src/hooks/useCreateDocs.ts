import * as pdfjs from 'pdfjs-dist'
import { PREVIEW_CANVAS_WIDTH } from '@/types/slides'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as bfb64 from 'bfb64-conv'
import { message } from 'ant-design-vue'
import useQiniuUpload from './useQiniuUpload'
import { createDocs, updateDocs } from '@/apis/docs'

export default () => {
  const { uploadFile } = useQiniuUpload()

  const createPdfDocs = async (file: File, teamId: string, onProgress?: (percent: number) => void) => {
    try {
      const buffer = await file.arrayBuffer()
      const task = pdfjs.getDocument(Buffer.from(buffer))
      const pdf = await task.promise
      const firstPage = await pdf.getPage(1)

      const [w, h] = firstPage?._pageInfo?.view?.slice(-2) || []
      const scale = PREVIEW_CANVAS_WIDTH / w
      const canvas = document.createElement('canvas')
      const viewport = firstPage.getViewport({ scale })
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      await firstPage.render({
        canvasContext: context,
        viewport,
      }).promise

      const previewImageBase64 = canvas.toDataURL()
      const priviewImageFile = bfb64.b64toFile(previewImageBase64, 'pdf-preview')

      const pdfResult = await uploadFile(file, `shot/${Date.now()}/${file.name}`, (percent) => {
        onProgress?.(percent / 2)
      })
      const pdfPreviewResult = await uploadFile(priviewImageFile, `shot/${Date.now()}.png`, (percent) => {
        onProgress?.(50 + percent / 2)
      })

      const docs = await createDocs(teamId, file.name, 'pdf')
      const docsId = docs._id
      const updatedDocs = await updateDocs(docsId, pdfPreviewResult.url, 'pdf', pdfResult.url)
      return updatedDocs
    }
    catch (err) {
      let msg: string
      switch ((err as any).code) {
        case 1:
          msg = '当前文档需要密码访问'
          break
        default:
          msg = 'PDF 格式不正确'
      }
      void message.warning(msg)
    }
  }

  return {
    createPdfDocs,
  }
}
