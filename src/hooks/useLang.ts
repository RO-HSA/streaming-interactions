import { create } from "zustand"

interface useLangStore {
  uiLang: string
  commentLang: string
  setUiLang: (lang: string) => void
  setCommentLang: (lang: string) => void
}

export const useLang = create<useLangStore>((set) => ({
  uiLang: "",
  commentLang: "",
  setUiLang: (lang) => {
    set(() => ({ uiLang: lang }))
  },
  setCommentLang: (lang) => {
    set(() => ({ commentLang: lang }))
  }
}))
