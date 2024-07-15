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
          borderRadius: "6px",
          cursor: "pointer",
          backgroundColor: "var(--si-amethyst-500)",
          color: "var(--si-amethyst-50)",
          fontSize: "16px",
          fontWeight: "bold"
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
