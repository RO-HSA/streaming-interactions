import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (_, res) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].id) {
      if (tabs[0].url.includes("crunchyroll")) {
        const newUrl = "watch/" + tabs[0].url.split("watch/")[1].split("?")[0]
        res.send({ url: newUrl })
      } else {
        res.send({ url: tabs[0].url.split("?")[0] })
      }
    }
  })
}

export default handler
