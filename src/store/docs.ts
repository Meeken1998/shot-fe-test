import { Docs } from '@/apis/docs'
import { ShareLink } from '@/apis/shareLink'
import { Team } from '@/apis/team'
import { defineStore } from 'pinia'

interface PDFController {
  loaded: boolean
  scaleMode: string
  scaleModeList: string[]
  isSinglePageMode: boolean
  eventBus: {
    type: string
    data?: any
    _time?: number
  }
  findBarOpened: boolean
  sidebarOpened: boolean
}

interface DocsStoreState {
  docs: Docs | null
  team: Team | null
  shareLink: ShareLink | null
  pdfController: Partial<PDFController> | null
  currentSlideIndex: number
}

export const useDocsStore = defineStore('docs', {
  state: (): DocsStoreState => {
    return {
      docs: null,
      team: null,
      shareLink: null,
      pdfController: {
        loaded: false,
        scaleModeList: ['auto', 'page-actual', 'page-fit', 'page-width'],
        sidebarOpened: true
      },
      currentSlideIndex: 0,
    }
  },

  actions: {
    setDocs(val: Docs) {
      this.docs = val
    },

    setTeam(val: Team) {
      this.team = val
    },

    updatePdfController(val: Partial<PDFController>) {
      this.pdfController = {
        ...(this.pdfController || {}),
        ...val,
      }
    },

    emitEvent(e: PDFController['eventBus']) {
      this.updatePdfController({
        eventBus: {
          ...e,
          _time: Date.now(),
        },
      })
    },

    setCurrentSlideIndex(val: number) {
      this.currentSlideIndex = val
    },

    setShareLink(val: ShareLink) {
      this.shareLink = val
    }
  },
})
