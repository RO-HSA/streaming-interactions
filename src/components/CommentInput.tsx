import { useContent } from "@/hooks/useContent"
import { useLang } from "@/hooks/useLang"
import { supabase } from "@/services/supabase"
import type { TablesInsert, TablesUpdate } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import {
  useEffect,
  useState,
  type FC,
  type FormEvent,
  type KeyboardEvent
} from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./CommentInput.module.css"

interface CommentInputProps {
  type?: "comment" | "reply" | "edit"
  value?: string
  editType?: "comment" | "reply"
  parent_id?: string
  editId?: string
}

const CommentInput: FC<CommentInputProps> = ({
  type = "comment",
  value,
  editType,
  editId,
  parent_id
}) => {
  const [comment, setComment] = useState<string>("")
  const [currentUrl, setCurrentUrl] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, _] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })
  const [userLang, setUserLang] = useStorage<string>({
    key: "user_lang",
    instance: new Storage({
      area: "local"
    })
  })

  const {
    setSingleComment,
    updateComment,
    setReply,
    setReplyingId,
    setEditId,
    setEditedReply
  } = useContent()

  const { commentLang } = useLang()

  useEffect(() => {
    if (value) {
      setComment(value)
    }

    chrome.runtime.onMessage.addListener((obj) => {
      const { url } = obj
      if (url !== currentUrl) {
        setCurrentUrl(url)
      }

      sendToBackground({ name: "initial-url" }).then((value) =>
        setCurrentUrl(value.url)
      )
    })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const browserLang = chrome.i18n.getUILanguage()

    switch (type) {
      case "comment":
        if (comment !== "" && comment.trim() !== "") {
          const resp = await sendToBackground({ name: "initial-url" })

          const payload: TablesInsert<"comments"> = {
            url: resp.url,
            username: user.user_metadata.username,
            user_avatar: user.user_metadata.avatar,
            user_id: user.id,
            comment,
            lang: commentLang || userLang || browserLang
          }

          await supabase.from("comments").insert([payload])

          setSingleComment({
            ...payload,
            created_at: new Date().toString(),
            id: crypto.randomUUID()
          })
        }
        setComment("")
        setIsLoading(false)
        break
      case "reply":
        if (comment !== "" && comment.trim() !== "") {
          const payload: TablesInsert<"replies"> = {
            id: crypto.randomUUID(),
            parent_id,
            username: user.user_metadata.username,
            user_avatar: user.user_metadata.avatar,
            user_id: user.id,
            comment
          }

          await supabase.from("replies").insert([payload])

          setReply({
            ...payload,
            created_at: new Date().toString()
          })
        }
        setComment("")
        setReplyingId(null)
        setIsLoading(false)
        break
      case "edit":
        if (comment !== "" && comment.trim() !== "") {
          if (editType === "comment") {
            const payload: TablesUpdate<"comments"> = {
              comment,
              is_edited: true
            }

            const { data: updateCommentsResponse } = await supabase
              .from("comments")
              .update(payload)
              .eq("id", editId)
              .select()

            if (updateCommentsResponse) {
              updateComment(editId, updateCommentsResponse[0])
              setEditId(null)
            }

            setIsLoading(false)
          }
          if (editType === "reply") {
            const payload: TablesUpdate<"replies"> = {
              comment,
              is_edited: true
            }

            const { data: updateRepliesResponse } = await supabase
              .from("replies")
              .update(payload)
              .eq("id", editId)
              .select()

            if (updateRepliesResponse) {
              setEditedReply({
                reply: updateRepliesResponse[0],
                id: updateRepliesResponse[0].id
              })
              setEditId(null)
            }
            setIsLoading(false)
          }
        }
        break
      default:
        break
    }
  }

  const disabled = !user || user === undefined

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation()

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  return (
    <form
      className={style.commentsForm}
      style={{ gap: type === "comment" ? "12px" : "8px" }}
      onSubmit={handleSubmit}>
      <textarea
        className={[
          style.commentInput,
          type === "edit" || type === "reply" ? style.editInput : ""
        ].join(" ")}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className={[style.modal, disabled ? style.visible : ""].join(" ")}>
        <span>
          You must be logged in to comment,
          <br />
          click on the extension icon to log in
        </span>
      </div>
      <div className={style.buttonWrapper}>
        {type === "reply" || type === "edit" ? (
          <>
            <button
              type="reset"
              onClick={() => {
                if (type === "reply") setReplyingId(null)
                if (type === "edit") setEditId(null)
              }}
              disabled={isLoading}
              className={style.cancelBtn}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled || isLoading}
              className={style.replyEditBtn}>
              {type === "reply" ? "Reply" : "Edit"}
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={disabled || isLoading}
            className={style.submitBtn}>
            Comment
          </button>
        )}
      </div>
    </form>
  )
}

export default CommentInput
