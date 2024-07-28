import logo from "data-base64:../../../assets/images/logo.svg"
import type { FC } from "react"

import * as style from "./Logo.module.css"

interface LogoProps {
  paddingBottom?: string
  fontSize: string
  imageWidth?: string
  imageHeight?: string
}

const Logo: FC<LogoProps> = ({
  paddingBottom,
  fontSize,
  imageWidth = "58px",
  imageHeight = "58px"
}) => {
  return (
    <div className={style.brand} style={{ paddingBottom }}>
      <img
        src={logo}
        alt="logo"
        style={{ width: imageWidth, height: imageHeight }}
      />
      <h1 style={{ fontSize }}>
        Streaming
        <br />
        Interactions
      </h1>
    </div>
  )
}

export default Logo
