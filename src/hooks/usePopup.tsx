import { create } from "zustand"

interface usePopupStore {
  authType: auth
  setAuthType: (payload: auth) => void
}

type auth = "LOGGED" | "REGISTER" | "LOGIN" | "RECOVERY"

export const usePopup = create<usePopupStore>((set) => ({
  authType: "LOGIN",
  setAuthType: (payload) => {
    set(() => ({ authType: payload }))
  }
}))
