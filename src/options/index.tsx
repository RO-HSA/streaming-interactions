import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./options.module.css"

import "react-toastify/dist/ReactToastify.css"
import "@/styles/globals.css"
import "@/styles/fonts.css"

import AccountSettings from "@/components/AccountSettings"
import Menu from "@/components/Menu"
import PreferencesSettings from "@/components/PreferencesSettings"
import Logo from "@/components/UI/Logo"
import { useOptions } from "@/hooks/useOptions"
import { Center } from "@chakra-ui/react"

const Options = () => {
  const [user, _] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const { avatar } = useOptions()

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
          <main className={style.container}>
            <Menu />
            <div className={style.content}>
              <AccountSettings
                user={user?.user_metadata.username}
                email={user?.email}
                currentAvatar={user?.user_metadata.avatar}
              />
              <PreferencesSettings />
            </div>
          </main>
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
          <h1 style={{ color: "var(--si-amethyst-50)", fontSize: "42px" }}>
            You need to logged in to see this page <br /> Click on this
            extension icon to log in
          </h1>
        </div>
      )}
    </>
  )
}

export default Options
