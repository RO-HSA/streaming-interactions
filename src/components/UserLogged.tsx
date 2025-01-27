import Button from "@/components/UI/Button"
import { usePopup } from "@/hooks/usePopup"
import { i18n } from "@/lib/utils"
import { supabase } from "@/services/supabase"
import type { User } from "@supabase/supabase-js"
import type { FC } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./UserLogged.module.css"

interface UserLoggedProps {
  user: User
}

const UserLogged: FC<UserLoggedProps> = ({ user }) => {
  const { setAuthType } = usePopup()
  const [_, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAuthType("LOGIN")
  }

  return (
    <div className={style.wrapper}>
      <h3 className={style.welcomeMessage}>
        {i18n("welcome")} <span>{user?.user_metadata.username}</span>!
      </h3>
      <Button
        className={style.btn}
        onClick={() => chrome.runtime.openOptionsPage()}>
        {i18n("settings")}
      </Button>
      <Button className={style.btn} onClick={logout}>
        {i18n("logout")}
      </Button>
    </div>
  )
}

export default UserLogged
