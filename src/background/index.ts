import { supabase } from "@/services/supabase"

chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  const { data } = await supabase.auth.getSession()

  if (tab.url) {
    chrome.tabs.sendMessage(tabId, {
      url: tab.url.split("?")[0],
      userLang: data.session.user?.user_metadata.comment_lang
    })
  }
})
