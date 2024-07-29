import * as style from "@/components/Sidebar.module.css"
import styleText from "data-text:../components/Sidebar.module.css"
import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoGetStyle,
  PlasmoRender
} from "plasmo"
import { createRoot } from "react-dom/client"

import "@/styles/globals.css"

import Sidebar from "@/components/Sidebar"

export const config: PlasmoCSConfig = {
  matches: ["https://*.crunchyroll.com/*"],
  css: ["../styles/fonts.css"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const rootContainerParent = document.body

      if (rootContainerParent) {
        clearInterval(checkInterval)
        const rootContainer = document.createElement("div")
        rootContainer.id = "si-container"
        rootContainer.className = style.sidebar
        rootContainerParent.appendChild(rootContainer)
        resolve(rootContainer)
      }
    }, 137)
  })

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)

  root.render(<Sidebar key="si-crunchyroll" />)
}
