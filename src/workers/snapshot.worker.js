import { toJpeg } from 'html-to-image'

self.addEventListener('message', async (e) => {
  const { type, dom } = e.data
  if (type === 'snapshot') {
    const jpg = await toJpeg(dom, {
      quality: 1,
      canvasWidth: 640,
      canvasHeight: 360,
    })
    self.postMessage({
      type: 'snapshot_resp',
      jpg,
    })
  }
})
