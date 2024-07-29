import type { FC, ReactNode } from "react"

import * as style from "./SettingsBox.module.css"

interface SettingsBoxProps {
  id: string
  title: string
  description: string
  children?: ReactNode
}

const SettingsBox: FC<SettingsBoxProps> = ({
  id,
  title,
  description,
  children
}) => {
  return (
    <div className={style.box} id={id}>
      <div className={style.header}>
        <h3 className={style.title}>{title}</h3>
        <span className={style.description}>{description}</span>
      </div>
      {children}
    </div>
  )
}

export default SettingsBox
