import Register from "@/components/Register"
import { supabase } from "@/services/supabase"
import type { User } from "@supabase/supabase-js"
import kofi from "data-base64:../../assets/images/ko-fi.svg"
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
import { useLang } from "@/hooks/useLang"
import { usePopup } from "@/hooks/usePopup"
import {
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme
} from "@chakra-ui/react"

const Popup = () => {
  const { authType, setAuthType } = usePopup()

  const { setUiLang, setCommentLang } = useLang()

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
        setUiLang(data.session.user.user_metadata.ui_lang)
        setCommentLang(data.session.user.user_metadata.comment_lang)
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
        {authType !== "REGISTER" && (
          <p className={style.kofi}>
            Want to support my work?
            <a href="https://ko-fi.com/H2H810IYZG" target="_blank">
              buy me a coffee
              <img src={kofi} width={16} alt="ko-fi" />
            </a>
          </p>
        )}
      </main>
      <ToastContainer theme="dark" />
    </ChakraBaseProvider>
  )
}

export default Popup
