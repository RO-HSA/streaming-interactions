import { supabase } from "@/services/supabase"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  await supabase.auth.setSession(req.body)

  res.send({ success: true })
}

export default handler
