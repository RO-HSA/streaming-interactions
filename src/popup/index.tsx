import Register from "@/components/Register"
import { supabase } from "@/services/supabase"
import type { User } from "@supabase/supabase-js"
import logo from "data-base64:../../assets/images/icon.svg"
import { useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./popup.module.css"

import "@/styles/globals.css"
import "@/styles/fonts.css"
import "react-toastify/dist/ReactToastify.css"

import Login from "@/components/Login"
import PasswordRecovery from "@/components/PasswordRecovery"
import Logo from "@/components/UI/Logo"
import UserLogged from "@/components/UserLogged"
import { usePopup } from "@/hooks/usePopup"
import {
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme
} from "@chakra-ui/react"

const Popup = () => {
  const { authType, setAuthType } = usePopup()

  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    async function init() {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        toast.error(error.message)
        return
      }
      if (!!data.session) {
        setUser(data.session.user)
        setAuthType("LOGGED")
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: data.session.refresh_token,
            access_token: data.session.access_token
          }
        })
      }
    }

    init()
  }, [])

  const { Spinner } = chakraTheme.components

  const theme = extendBaseTheme({
    components: {
      Spinner
    }
  })

  return (
    <ChakraBaseProvider theme={theme} disableGlobalStyle={true}>
      <main className={style.container}>
        {authType !== "REGISTER" && (
          <Logo paddingBottom="26px" fontSize="22px" />
        )}
        <div className={style.content}>
          {authType === "LOGGED" ? (
            <UserLogged user={user} />
          ) : authType === "RECOVERY" ? (
            <PasswordRecovery />
          ) : authType === "LOGIN" ? (
            <Login />
          ) : (
            <Register />
          )}
        </div>
        <p className={style.kofi}>
          Want to support my work?
          <a href="https://ko-fi.com/H2H810IYZG" target="_blank">
            <img
              height="36"
              style={{ border: 0, height: "36px" }}
              src="https://storage.ko-fi.com/cdn/kofi2.png?v=3"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
        </p>
      </main>
      <ToastContainer theme="dark" />
    </ChakraBaseProvider>
  )
}

export default Popup
