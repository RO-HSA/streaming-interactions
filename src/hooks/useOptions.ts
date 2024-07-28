import { create } from "zustand"

interface useOptionsStore {
  avatar: string | ArrayBuffer
  setAvatar: (payload: string | ArrayBuffer) => void
}

export const useOptions = create<useOptionsStore>((set) => ({
  avatar: "",
  setAvatar: (payload) => {
    set(() => ({ avatar: payload }))
  }
}))
