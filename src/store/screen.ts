import { defineStore } from 'pinia'

export interface ScreenState {
  screening: boolean
  clientWidth: number
}

export const useScreenStore = defineStore('screen', {
  state: (): ScreenState => ({
    screening: false, // 是否进入放映状态
    clientWidth: 1280
  }),

  actions: {
    setScreening(screening: boolean) {
      this.screening = screening
    },
  },
})