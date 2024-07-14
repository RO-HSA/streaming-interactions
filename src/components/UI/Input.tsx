import { forwardRef, type InputHTMLAttributes } from "react"

import * as style from "./Input.module.css"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={[style.input, className].join(" ")}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export default Input
