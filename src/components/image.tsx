import type React from "react"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(({ className, src, alt, ...props }, ref) => {
  return (
    <img
      ref={ref}
      src={src || "/placeholder.svg"}
      alt={alt}
      className={cn("max-w-full h-auto object-cover", className)}
      {...props}
    />
  )
})

Image.displayName = "Image"