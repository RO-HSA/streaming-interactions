import type { FC } from "react"

import * as style from "./Loading.module.css"

interface Props {
  width?: string
  height?: string
}

const Loading: FC<Props> = ({ width = "100%", height = "100%" }) => {
  return (
    <div style={{ width, height }} className={style.container}>
      <span className={style.loader}></span>
    </div>
  )
}

export default Loading
