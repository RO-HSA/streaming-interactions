import type { FC } from "react"

import * as style from "./Loading.module.css"

interface Props {
  width?: string
  height?: string
  size?: string
  variant?: "ring" | "eclipse"
}

const Loading: FC<Props> = ({
  variant = "ring",
  width = "32px",
  height = "32px",
  size
}) => {
  if (variant === "ring") {
    return (
      <div
        style={{ width: size, height: size }}
        className={style.ringContainer}>
        <span style={{ width, height }} className={style.ring}></span>
      </div>
    )
  }

  if (variant === "eclipse") {
    return (
      <div className={style.eclipseContainer}>
        <div className={style.eclipse}>
          <div></div>
        </div>
      </div>
    )
  }
}

export default Loading
