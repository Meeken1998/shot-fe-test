import { defineStore } from 'pinia'
import tinycolor from 'tinycolor2'
import { omit, throttle } from 'lodash'
import { Slide, SlideTheme, PPTElement, PPTAnimation } from '@/types/slides'
import { slides } from '@/mocks/slides'
import { theme } from '@/mocks/theme'
import { layouts } from '@/mocks/layout'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WebWorker from '@/workers/sync.worker.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SnapshotWorker from '@/workers/snapshot.worker.js'
import { getUserInfoById } from '@/apis/user'
import { toJpeg } from 'html-to-image'
import { WS_SERVICE_ENDPOINT } from '@/hooks/useRequest'

const worker: Worker = new WebWorker()
const snapshotWorker: Worker = new SnapshotWorker()
interface RemoveElementPropData {
  id: string
  propName: string | string[]
}

interface UpdateElementData {
  id: string | string[]
  props: Partial<PPTElement>
}

interface FormatedAnimation {
  animations: PPTAnimation[]
  autoNext: boolean
}

interface ICoopUserInfo {
  currentSlide?: number;
  avatar?: string;
}

export interface SlidesState {
  theme: SlideTheme
  slides: Slide[]
  slideIndex: number
  viewportRatio: number
  docsId: string
  coopUsers: string[]
  coopUserInfo: Record<string, ICoopUserInfo>
  cloudSlidesLoaded: boolean
}

interface IBroadcastDocUpdateMessage {
  event: 'broadcast-update'
  data: Record<string, any> & { type: string, slideIndex?: number, data: any }
}

interface IBroadcastUserMessage {
  event: 'broadcast-user'
  data: {
    users: string[]
  }
}

interface IBroadcastUserTrivialMessage {
  event: 'broadcast-user-trivial'
  fromUser: string
  data: IUserTrivialMessageSlideSelectionData
}

interface IUserTrivialMessageSlideSelectionData {
  type: 'slide-selection'
  slideIndex: number
}

type BroadcastMessageType = IBroadcastUserMessage | IBroadcastDocUpdateMessage | IBroadcastUserTrivialMessage;

let coopWs: WebSocket | undefined

export const useSlidesStore = defineStore('slides', {
  state: (): SlidesState => ({
    theme: theme, // 主题样式
    slides: slides, // 幻灯片页面数据
    slideIndex: 0, // 当前页面索引
    viewportRatio: 0.5625, // 可是区域比例，默认16:9
    docsId: '', // 云文档 id
    coopUsers: [localStorage.getItem('token')!],
    coopUserInfo: {},
    cloudSlidesLoaded: false
  }),

  getters: {
    currentSlide(state) {
      return state.slides[state.slideIndex]
    },

    currentSlideAnimations(state) {
      const currentSlide = state.slides[state.slideIndex]
      if (!currentSlide?.animations) return []

      const els = currentSlide.elements
      const elIds = els.map((el) => el.id)
      return currentSlide.animations.filter((animation) => elIds.includes(animation.elId))
    },

    // 格式化的当前页动画
    // 将触发条件为“与上一动画同时”的项目向上合并到序列中的同一位置
    // 为触发条件为“上一动画之后”项目的上一项添加自动向下执行标记
    formatedAnimations(state) {
      const currentSlide = state.slides[state.slideIndex]
      if (!currentSlide?.animations) return []

      const els = currentSlide.elements
      const elIds = els.map((el) => el.id)
      const animations = currentSlide.animations.filter((animation) => elIds.includes(animation.elId))

      const formatedAnimations: FormatedAnimation[] = []
      for (const animation of animations) {
        if (animation.trigger === 'click' || !formatedAnimations.length) {
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
        else if (animation.trigger === 'meantime') {
          const last = formatedAnimations[formatedAnimations.length - 1]
          last.animations = last.animations.filter((item) => item.elId !== animation.elId)
          last.animations.push(animation)
          formatedAnimations[formatedAnimations.length - 1] = last
        }
        else if (animation.trigger === 'auto') {
          const last = formatedAnimations[formatedAnimations.length - 1]
          last.autoNext = true
          formatedAnimations[formatedAnimations.length - 1] = last
          formatedAnimations.push({ animations: [animation], autoNext: false })
        }
      }
      return formatedAnimations
    },

    layouts(state) {
      const { themeColor, fontColor, fontName, backgroundColor } = state.theme

      const subColor = tinycolor(fontColor).isDark() ? 'rgba(230, 230, 230, 0.5)' : 'rgba(180, 180, 180, 0.5)'

      const layoutsString = JSON.stringify(layouts)
        .replaceAll('{{themeColor}}', themeColor)
        .replaceAll('{{fontColor}}', fontColor)
        .replaceAll('{{fontName}}', fontName)
        .replaceAll('{{backgroundColor}}', backgroundColor)
        .replaceAll('{{subColor}}', subColor)

      return JSON.parse(layoutsString)
    },
  },

  actions: {
    setDocsId(id: string) {
      this.docsId = id
    },

    setTheme(themeProps: Partial<SlideTheme>) {
      this.theme = { ...this.theme, ...themeProps }
    },

    setViewportRatio(viewportRatio: number) {
      this.viewportRatio = viewportRatio
    },

    setSlides(slides: Slide[]) {
      this.slides = slides
    },

    addSlide(slide: Slide | Slide[], broadcastSlideIndex?: number, fromBroadcast = false) {
      const slides = Array.isArray(slide) ? slide : [slide]
      const slideIndex = broadcastSlideIndex ?? this.slideIndex
      const addIndex = slideIndex + 1
      this.slides.splice(addIndex, 0, ...slides)
      this._sync(this.docsId, this.slides.slice())
      if (!fromBroadcast) {
        this.slideIndex = addIndex
        coopWs?.send(JSON.stringify({ event: 'broadcast-update', data: { type: 'addSlide', slideIndex: addIndex - 1, data: slide } }))
      }
    },

    updateSlide(props: Partial<Slide>, broadcastSlideIndex?: number, fromBroadcast = false) {
      const slideIndex = broadcastSlideIndex ?? this.slideIndex
      this.slides[slideIndex] = { ...this.slides[slideIndex], ...props }
      this._sync(this.docsId, this.slides.slice())
      if (!fromBroadcast) coopWs?.send(JSON.stringify({ event: 'broadcast-update', data: { type: 'updateSlide', slideIndex: this.slideIndex, data: props } }))
    },

    deleteSlide(slideId: string | string[], _?: unknown, fromBroadcast = false) {
      const slidesId = Array.isArray(slideId) ? slideId : [slideId]

      const deleteSlidesIndex = []
      for (let i = 0; i < slidesId.length; i++) {
        const index = this.slides.findIndex((item) => item.id === slidesId[i])
        deleteSlidesIndex.push(index)
      }
      let newIndex = Math.min(...deleteSlidesIndex)

      const maxIndex = this.slides.length - slidesId.length - 1
      if (newIndex > maxIndex) newIndex = maxIndex

      this.slideIndex = newIndex
      this.slides = this.slides.filter((item) => !slidesId.includes(item.id))
      this._sync(this.docsId, this.slides.slice())
      if (!fromBroadcast) coopWs?.send(JSON.stringify({ event: 'broadcast-update', data: { type: 'deleteSlide', slideIndex: this.slideIndex, data: slideId } }))
    },

    updateSlideIndex(index: number) {
      this.slideIndex = index
      coopWs?.send(JSON.stringify({ event: 'broadcast-user-trivial', data: { type: 'slide-selection', slideIndex: index } }))
    },

    addElement(element: PPTElement | PPTElement[], broadcastSlideIndex?: number, fromBroadcast = false) {
      const elements = Array.isArray(element) ? element : [element]
      const slideIndex = broadcastSlideIndex ?? this.slideIndex
      const currentSlideEls = this.slides[slideIndex].elements
      const newEls = [...currentSlideEls, ...elements]
      this.slides[slideIndex].elements = newEls
      this._sync(this.docsId, this.slides.slice())
      if (!fromBroadcast) coopWs?.send(JSON.stringify({ event: 'broadcast-update', data: { type: 'addElement', slideIndex: this.slideIndex, data: element } }))
    },

    deleteElement(elementId: string | string[], broadcastSlideIndex?: number, fromBroadcast = false) {
      const elementIdList = Array.isArray(elementId) ? elementId : [elementId]
      const slideIndex = broadcastSlideIndex ?? this.slideIndex
      const currentSlideEls = this.slides[slideIndex].elements
      const newEls = currentSlideEls.filter((item) => !elementIdList.includes(item.id))
      this.slides[slideIndex].elements = newEls
      this._sync(this.docsId, this.slides.slice())
      if (!fromBroadcast) coopWs?.send(JSON.stringify({ event: 'broadcast-update', data: { type: 'deleteElement', slideIndex: this.slideIndex, data: elementId } }))
    },

    updateElement(data: UpdateElementData, broadcastSlideIndex?: number, fromBroadcast = false) {
      const { id, props } = data
      const elIdList = typeof id === 'string' ? [id] : id

      const slideIndex = broadcastSlideIndex ?? this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map((el) => {
        return elIdList.includes(el.id) ? { ...el, ...props } : el
      })
      this.slides[slideIndex].elements = elements as PPTElement[]
      if (!fromBroadcast) coopWs?.send(JSON.stringify({ event: 'broadcast-update', data: { type: 'updateElement', slideIndex: this.slideIndex, data } }))
    },

    _sync: throttle(async (docsId: string, slides: Slide[]) => {
      const dom = document.querySelector('.thumbnail-item .thumbnail') as HTMLElement
      const jpg = dom ? await toJpeg(dom, {
        quality: 0.75,
        canvasWidth: 640,
        canvasHeight: 360,
        style: {
          outline: 'unset'
        }
      }) : ''
      worker.postMessage({
        type: 'sync',
        json: JSON.stringify(slides),
        docsId,
        jpg,
        token: localStorage.getItem('token'),
        isDev: process.env.NODE_ENV === 'development',
      })
    }, 3000),

    _snapshoot() {
      const dom = document.querySelector('.thumbnail-item .thumbnail') as HTMLElement
      snapshotWorker.postMessage({
        type: 'snapshot',
        dom,
      })
    },

    removeElementProps(data: RemoveElementPropData, broadcastSlideIndex?: number, fromBroadcast = false) {
      const { id, propName } = data
      const propsNames = typeof propName === 'string' ? [propName] : propName

      const slideIndex = broadcastSlideIndex ?? this.slideIndex
      const slide = this.slides[slideIndex]
      const elements = slide.elements.map((el) => {
        return el.id === id ? omit(el, propsNames) : el
      })
      this.slides[slideIndex].elements = elements as PPTElement[]
    },

    updateCoopUsers(userIds: string[]) {
      this.coopUsers = userIds
      userIds.forEach((userId) => {
        if (this.coopUserInfo[userId]?.avatar) return
        
        getUserInfoById(userId).then((user) => {
          this.updateCoopUserAvatar(userId, user.photo ?? '')
        })
      })
    },

    updateCoopUserInfo(userId: string, data: Partial<ICoopUserInfo>) {
      this.coopUserInfo[userId] ??= {}
      this.coopUserInfo[userId] = { ...this.coopUserInfo[userId], ...data }
    },

    updateCoopUserAvatar(userId: string, avatar: string) {
      this.coopUserInfo[userId] ??= {}
      this.coopUserInfo[userId].avatar = avatar
    },

    connectWebsocket() {
      const ws = new WebSocket(WS_SERVICE_ENDPOINT)
      ws.onopen = () => {
        ws.send(JSON.stringify({ event: 'auth', data: { docId: this.docsId, token: localStorage.getItem('token'), } }))
        coopWs = ws
      }
      ws.onmessage = (msg) => {
        const parsed = JSON.parse(msg.data) as BroadcastMessageType
        if (parsed.event === 'broadcast-update') {
          this[parsed.data.type](parsed.data.data, parsed.data.slideIndex, true)
        }
        else if (parsed.event === 'broadcast-user') {
          this.updateCoopUsers(parsed.data.users)
        }
        else if (parsed.event === 'broadcast-user-trivial') {
          if (parsed.data.type === 'slide-selection') {
            this.updateCoopUserInfo(parsed.fromUser, { currentSlide: parsed.data.slideIndex })
          }
        }
      }
    },

    cloudSlidesLoadedCallback() {
      if (this.cloudSlidesLoaded) return
      this.cloudSlidesLoaded = true
      this._sync(this.docsId, this.slides.slice())
    },

    closeWebsocket() {
      coopWs?.close()
    },
  },
})
