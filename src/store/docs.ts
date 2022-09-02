import { Docs } from '@/apis/docs'
import { Team } from '@/apis/team'
import { defineStore } from 'pinia'

interface DocsStoreState {
  docs: Docs | null
  team: Team | null
}

export const useDocsStore = defineStore('docs', {
  state: (): DocsStoreState => {
    return {
      docs: null,
      team: null,
    }
  },

  actions: {
    setDocs(val: Docs) {
      this.docs = val
    },

    setTeam(val: Team) {
      this.team = val
    },
  },
})
