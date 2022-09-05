import { Docs } from '@/apis/docs'
import { Team } from '@/apis/team'
import { defineStore } from 'pinia'

interface PDFController {
  scaleMode: string
  scaleModeList: string[]
  changedMode: string
}

interface DocsStoreState {
  docs: Docs | null
  team: Team | null
  pdfController: Partial<PDFController> | null
}

export const useDocsStore = defineStore('docs', {
  state: (): DocsStoreState => {
    return {
      docs: null,
      team: null,
      pdfController: {
        scaleModeList: ['auto', 'page-actual', 'page-fit', 'page-width'],
      },
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
  },
})
