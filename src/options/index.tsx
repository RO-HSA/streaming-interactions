import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./options.module.css"

import "react-toastify/dist/ReactToastify.css"
import "@/styles/globals.css"
import "@/styles/fonts.css"

import AccountSettings from "@/components/AccountSettings"
import Menu from "@/components/Menu"
import PasswordChange from "@/components/PasswordChange"
import PreferencesSettings from "@/components/PreferencesSettings"
import Logo from "@/components/UI/Logo"
import { useLang } from "@/hooks/useLang"
import { useMenu } from "@/hooks/useMenu"
import { useOptions } from "@/hooks/useOptions"
import { i18n } from "@/lib/utils"
import { supabase } from "@/services/supabase"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

import { sendToBackground } from "@plasmohq/messaging"

const Options = () => {
  const [optionsNav, setOptionsNav] = useState<"menu" | "recovery">("menu")
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const { avatar } = useOptions()
  const { navigation } = useMenu()
  const { setUiLang, setCommentLang } = useLang()

  useEffect(() => {
    const typeParams = new URLSearchParams(window.location.href).get("type")

    if (typeParams === "recovery") {
      setOptionsNav("recovery")
    }

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

  if (optionsNav === "recovery") {
    return <PasswordChange />
  }

  return (
    <>
      {user ? (
        <>
          <header className={style.header}>
            <div className={style.headerContent}>
              <Logo fontSize="18px" imageWidth="44px" imageHeight="44px" />
              <div className={style.userInfo}>
                <span className={style.username}>
                  {user?.user_metadata.username}
                </span>
                {avatar || user?.user_metadata.avatar ? (
                  <img
                    src={avatar ? avatar : user?.user_metadata.avatar}
                    alt="Avatar"
                    className={style.userAvatar}
                  />
                ) : (
                  <div className={style.userAvatar} />
                )}
              </div>
            </div>
          </header>
          <div className={style.container}>
            <Menu />
            <main className={style.content}>
              {navigation === "account" ? (
                <AccountSettings
                  user={user?.user_metadata.username}
                  email={user?.email}
                  currentAvatar={user?.user_metadata.avatar}
                />
              ) : (
                <PreferencesSettings />
              )}
            </main>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh"
          }}>
          <h3
            style={{
              color: "var(--si-amethyst-50)",
              fontSize: "42px",
              maxWidth: "720px"
            }}>
            {i18n("userNotLoggedOptions")}
          </h3>
        </div>
      )}
      <ToastContainer theme="dark" />
    </>
  )
}

export default Options
