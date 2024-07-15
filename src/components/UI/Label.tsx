import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react"

import * as style from "./Label.module.css"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

const Label = forwardRef<HTMLInputElement, LabelProps>(
  ({ children, className, ...props }) => {
    return (
      <label className={[style.label, className].join(" ")} {...props}>
        {children}
      </label>
    )
  }
)

export default Label
