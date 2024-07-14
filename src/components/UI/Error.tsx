import type { FC } from "react"

interface ErrorProps {
  message: string
  className?: string
}

const Error: FC<ErrorProps> = ({ message, className }) => {
  return (
    <p
      className={className}
      style={{ color: "var(--si-error)", marginTop: "4px", marginBottom: "0" }}>
      {message}
    </p>
  )
}

export default Error
