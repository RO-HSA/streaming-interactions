import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        style={{
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          backgroundColor: "var(--si-primary)",
          color: "var(--si-text)"
        }}
        className={className}
        ref={ref}
        {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button