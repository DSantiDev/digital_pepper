export const Arrow = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 15 15 5M7 5h8v8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export const Chevron = () => (
  <svg className="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="m4 6 4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)
