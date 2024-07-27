import type { FC } from "react"

import styles from "./loading.module.css"

interface Props {
  width?: string
  height?: string
}

const Loading: FC<Props> = ({ width = "100%", height = "100%" }) => {
  return (
    <div style={{ width, height }} className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  )
}

export default Loading
