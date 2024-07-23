export interface Comment {
  id?: string
  user_id: string
  username: string | null
  user_avatar: string | null
  url: string
  created_at?: string
  comment: string
}
