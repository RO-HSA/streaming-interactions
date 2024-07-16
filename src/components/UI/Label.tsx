import { forwardRef, type LabelHTMLAttributes, type ReactNode } from "react"

import * as style from "./Label.module.css"

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <label
        className={[style.label, className].join(" ")}
        ref={ref}
        {...props}>
        {children}
      </label>
    )
  }
)

export default Label
