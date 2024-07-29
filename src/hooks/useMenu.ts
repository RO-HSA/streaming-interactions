import { create } from "zustand"

interface useMenuStore {
  navigation: navigationType
  setNavigation: (nav: navigationType) => void
}

export type navigationType = "account" | "preferences"

export const useMenu = create<useMenuStore>((set) => ({
  navigation: "account",
  setNavigation: (nav) => {
    set(() => ({ navigation: nav }))
  }
}))
