interface RomanSectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export default function RomanSectionHeader({
  title,
  subtitle,
  centered = true,
  className = "",
}: RomanSectionHeaderProps) {
  return (
    <div className={`mb-8 ${centered ? "text-center" : ""} ${className}`}>
      <div className="flex items-center justify-center gap-4 mb-2">
        <div className="h-px bg-gradient-to-r from-transparent via-roman-gold-400/70 to-transparent flex-grow max-w-xs"></div>
        <h2 className="text-3xl font-romanTitle uppercase tracking-wider text-roman-gold">{title}</h2>
        <div className="h-px bg-gradient-to-r from-transparent via-roman-gold-400/70 to-transparent flex-grow max-w-xs"></div>
      </div>
      {subtitle && <p className="text-roman-gold-600 mt-2">{subtitle}</p>}
    </div>
  )
}
