import { useContent } from "@/hooks/useContent"
import { formatDate } from "@/lib/utils"
import { supabase } from "@/services/supabase"
import type { TablesInsert, TablesUpdate } from "@/types/supabase"
import type { User } from "@supabase/supabase-js"
import { useEffect, useMemo, useState, type FC } from "react"
import ReactMarkdown from "react-markdown"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import * as style from "./Comment.module.css"
import CommentInput from "./CommentInput"
import Loading from "./UI/Loading"

interface CommentProps {
  id: string
  username: string
  user_id: string
  user_avatar: string
  created_at: string
  comment: string
}

const Comment: FC<CommentProps> = ({
  id,
  username,
  user_id,
  user_avatar,
  created_at,
  comment
}: CommentProps) => {
  const [replies, setReplies] = useState<TablesInsert<"replies">[]>([])
  const [pagination, setPagination] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, _] = useStorage<User>({
    key: "user",
    instance: new Storage({
      area: "local"
    })
  })

  const { replyingId, reply, setReplyingId, editId, setEditId, editedReply } =
    useContent()

  useEffect(() => {
    setIsLoading(true)
    supabase
      .from("replies")
      .select("*")
      .eq("parent_id", id)
      .then(({ data }) => {
        setReplies(data)
        setIsLoading(false)
      })
  }, [])

  useMemo(() => {
    if (reply && reply.parent_id === id) {
      setReplies([reply, ...replies])
    }
  }, [reply])

  const repliesData = useMemo(() => {
    const updatedReplies = replies?.map((comment) =>
      comment?.id === editedReply?.id ? editedReply?.reply : comment
    ) as TablesUpdate<"replies">[]

    const sortByDate = updatedReplies?.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()

      return dateB - dateA
    })

    const trim = sortByDate?.slice(0, pagination)

    return trim
  }, [replies, pagination, editedReply])

  return (
    <div className={style.commentWrapper}>
      {user_avatar ? (
        <img src={user_avatar} alt="User Avatar" className={style.userAvatar} />
      ) : (
        <div className={style.userAvatar} />
      )}
      <div className={style.commentInfo}>
        <div className={style.userInfo}>
          <span className={style.username}>{username}</span>
          <span className={style.time}>{created_at}</span>
        </div>
        {editId === id ? (
          <CommentInput
            type="edit"
            editId={id}
            editType="comment"
            value={comment}
          />
        ) : (
          <ReactMarkdown className={style.comment}>{comment}</ReactMarkdown>
        )}
        {replyingId === id ? (
          <CommentInput type="reply" key={id} parent_id={id} />
        ) : (
          <div
            style={{ paddingBottom: "8px" }}
            className={style.commentToolkit}>
            {user?.id === user_id && editId !== id && (
              <button type="button" onClick={() => setEditId(id)}>
                Edit
              </button>
            )}
            {user?.id && editId !== id && (
              <button
                type="button"
                onClick={() => {
                  setReplyingId(id)
                }}>
                Reply
              </button>
            )}
          </div>
        )}
        {isLoading ? (
          <Loading />
        ) : (
          repliesData?.length > 0 &&
          repliesData?.map((reply) => {
            return (
              <div key={reply.id} className={style.commentWrapper}>
                {reply.user_avatar ? (
                  <img
                    src={reply.user_avatar}
                    alt="User Avatar"
                    className={style.userAvatar}
                  />
                ) : (
                  <div className={style.userAvatar} />
                )}
                <div className={style.commentInfo}>
                  <div className={style.userInfo}>
                    <span className={style.username}>{reply.username}</span>
                    <span className={style.time}>
                      {formatDate(reply.created_at, reply.is_edited)}
                    </span>
                  </div>
                  {editId === reply.id ? (
                    <CommentInput
                      type="edit"
                      editId={reply.id}
                      editType="reply"
                      value={reply?.comment}
                    />
                  ) : (
                    <ReactMarkdown className={style.comment}>
                      {reply?.comment}
                    </ReactMarkdown>
                  )}
                  <div className={style.commentToolkit}>
                    {user?.id === reply.user_id && editId !== reply.id && (
                      <button
                        type="button"
                        onClick={() => setEditId(reply?.id)}>
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
        {replies?.length > 1 && pagination < replies?.length && (
          <span
            className={style.showMoreReplies}
            onClick={() => setPagination(pagination + 2)}>
            show more replies
          </span>
        )}
      </div>
    </div>
  )
}

export default Comment
