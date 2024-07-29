import { forwardRef, type SelectHTMLAttributes } from "react"

import * as style from "./SelectInput.module.css"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={[style.select, className].join(" ")}
        ref={ref}
        {...props}>
        {children}
      </select>
    )
  }
)

export default SelectInput
