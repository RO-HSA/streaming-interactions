import { i18n } from "@/lib/utils"
import { MonitorCog, User } from "lucide-react"

export const menuItems = [
  {
    title: i18n("account"),
    nav: "account",
    icon: User
  },
  {
    title: i18n("preferences"),
    nav: "preferences",
    icon: MonitorCog
  }
]
