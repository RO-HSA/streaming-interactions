import type { TablesInsert, TablesUpdate } from "@/types/supabase"
import { create } from "zustand"

interface useContentStore {
  comments: TablesInsert<"comments">[]
  reply: TablesInsert<"replies"> | null
  replyingId: string
  editId: String
  editedReply: editReply
  setSingleComment: (payload: TablesInsert<"comments">) => void
  setComments: (payload: TablesInsert<"comments">[]) => void
  updateComment: (id: string, payload: TablesUpdate<"comments">) => void
  setReply: (payload: TablesInsert<"replies"> | null) => void
  setReplyingId: (payload: string) => void
  setEditId: (payload: string) => void
  setEditedReply: (payload: editReply) => void
}

type editReply = {
  reply: TablesUpdate<"replies">
  id: string
}

export const useContent = create<useContentStore>((set, get) => ({
  comments: [],
  reply: null,
  replyingId: "",
  editId: "",
  editedReply: null,
  setSingleComment: (payload) => {
    set(() => ({ comments: [...get().comments, payload] }))
  },
  setComments: (payload) => {
    set(() => ({ comments: payload }))
  },
  updateComment: (id, payload) => {
    const updatedArray = get().comments.map((comment) =>
      comment.id === id ? payload : comment
    )

    set(() => ({ comments: updatedArray as TablesInsert<"comments">[] }))
  },
  setReply: (payload) => {
    set(() => ({ reply: payload }))
  },
  setReplyingId: (payload) => {
    set(() => ({ replyingId: payload }))
  },
  setEditId: (payload) => {
    set(() => ({ editId: payload }))
  },
  setEditedReply: (payload) => {
    set(() => ({ editedReply: payload }))
  }
}))
