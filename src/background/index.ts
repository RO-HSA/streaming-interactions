import { supabase } from "@/services/supabase"

chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  const { data } = await supabase.auth.getSession()

  if (tab.url) {
    if (tab.url.includes("crunchyroll")) {
      const newUrl = "watch/" + tab.url.split("watch/")[1].split("?")[0]

      chrome.tabs.sendMessage(tabId, {
        url: newUrl,
        userLang: data.session.user?.user_metadata.comment_lang
      })
    } else {
      chrome.tabs.sendMessage(tabId, {
        url: tab.url.split("?")[0],
        userLang: data.session.user?.user_metadata.comment_lang
      })
    }
  }
})
