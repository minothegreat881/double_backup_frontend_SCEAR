import { Shield, Lock } from "lucide-react"
import Link from "next/link"

interface AdminLogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export default function AdminLogo({ size = "md", showText = true, className = "" }: AdminLogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <Link href="/admin" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-red-800`} />
        <Lock
          className={`absolute ${
            size === "sm"
              ? "h-3 w-3 -right-1 -bottom-1"
              : size === "md"
                ? "h-4 w-4 -right-1 -bottom-1"
                : "h-5 w-5 -right-2 -bottom-2"
          } text-stone-800 bg-white rounded-full p-0.5`}
        />
      </div>
      {showText && <span className="font-bold text-lg">Admin</span>}
    </Link>
  )
}
