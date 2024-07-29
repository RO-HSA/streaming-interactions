import Comment from "@/components/Comment"
import { useContent } from "@/hooks/useContent"
import { useLang } from "@/hooks/useLang"
import { formatDate } from "@/lib/utils"
import { supabase } from "@/services/supabase"
import type { User } from "@supabase/supabase-js"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { PlasmoCSUIProps } from "plasmo"
import { useEffect, useMemo, useState, type FC } from "react"
import { ToastContainer } from "react-toastify"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import CommentInput from "./CommentInput"
import * as style from "./Sidebar.module.css"
import Loading from "./UI/Loading"

const Sidebar: FC<PlasmoCSUIProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const { comments, setComments } = useContent()
  const { commentLang, setUiLang, setCommentLang } = useLang()

  useEffect(() => {
    chrome.runtime.onMessage.addListener((obj) => {
      const { url } = obj
      if (url !== currentUrl) {
        setCurrentUrl(url)
        setIsLoading(true)
      }
    })

    async function init() {
      const { data: user, error: userError } = await supabase.auth.getSession()
      const resp = sendToBackground({ name: "initial-url" })
      resp.then((value) => {
        if (value.url !== currentUrl) {
          setCurrentUrl(value.url)
          setIsLoading(true)
          const browserLang = chrome.i18n.getUILanguage()

          if (commentLang) {
            supabase
              .from("comments")
              .select("*")
              .eq("url", value.url)
              .eq("lang", commentLang)
              .then(({ data }) => {
                setComments(data)
                setIsLoading(false)
              })
          } else {
            supabase
              .from("comments")
              .select("*")
              .eq("url", value.url)
              .eq("lang", browserLang)
              .then(({ data }) => {
                setComments(data)
                setIsLoading(false)
              })
          }
        }
      })

      if (userError) {
        return
      }

      if (!!user.session) {
        setUser(user.session.user)
        setUiLang(user.session.user.user_metadata.ui_lang)
        setCommentLang(user.session.user.user_metadata.comment_lang)
        sendToBackground({
          name: "init-session",
          body: {
            refresh_token: user.session.refresh_token,
            access_token: user.session.access_token
          }
        })
      }
    }

    init()
  }, [commentLang])

  const rootContainer = document.getElementById("si-container")

  isOpen
    ? rootContainer.classList.add(style.open)
    : rootContainer.classList.remove(style.open)

  const commentsData = useMemo(() => {
    const sort = comments?.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return dateB - dateA
    })

    return sort
  }, [comments])

  return (
    <>
      <div className={[style.content, isOpen ? style.visible : ""].join(" ")}>
        <CommentInput
          type="comment"
          key={user?.id ? user?.id : "comment-input"}
        />
        <div className={style.commentsList}>
          {isLoading ? (
            <Loading />
          ) : (
            commentsData.map((item) => {
              return (
                <Comment
                  key={item.id}
                  id={item.id}
                  user_id={item.user_id}
                  username={item.username}
                  user_avatar={item.user_avatar}
                  created_at={formatDate(item.created_at, item.is_edited)}
                  comment={item.comment}
                />
              )
            })
          )}
        </div>
        <ToastContainer theme="dark" />
      </div>

      <div className={style.menu} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <ChevronRight color="var(--si-amethyst-500)" />
        ) : (
          <ChevronLeft color="var(--si-amethyst-500)" />
        )}
      </div>
    </>
  )
}

export default Sidebar
