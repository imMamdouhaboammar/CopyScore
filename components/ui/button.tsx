import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0f11] disabled:pointer-events-none disabled:opacity-50 cursor-pointer user-select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#0f0f11] text-white border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#52525b] hover:bg-[#1f1f23] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#52525b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#52525b]",
        peach:
          "bg-[#df9367] text-[#0f0f11] border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] hover:bg-[#e59d74] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#0f0f11] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0f0f11]",
        outline:
          "bg-white text-[#0f0f11] border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] hover:bg-[#faf9f6] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#0f0f11] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0f0f11]",
        secondary:
          "bg-[#eeece4] text-[#0f0f11] border-[1.5px] border-[#0f0f11] shadow-[2px_2px_0px_#0f0f11] hover:bg-[#e4e1d7] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#0f0f11] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0f0f11]",
        ghost:
          "hover:bg-[#eeece4] text-[#0f0f11] border border-transparent",
        link:
          "text-[#0f0f11] underline-offset-4 hover:underline p-0 h-auto font-mono",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 py-1.5 text-xs font-mono",
        lg: "h-12 px-6 py-3 text-base font-mono",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
