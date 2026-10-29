export function Footer() {
  return (
    <footer
      data-reveal
      className="motion-footer border-t border-white/10 bg-[#0d0912] px-5 py-8 sm:px-8 lg:px-14"
    >
      <div className="mx-auto flex max-w-[1330px] flex-col justify-between gap-4 text-sm text-white/40 sm:flex-row">
        <span>© {new Date().getFullYear()} Digital Pepper</span>
        <span>Diseño con intención. Código con carácter.</span>
      </div>
    </footer>
  )
}
