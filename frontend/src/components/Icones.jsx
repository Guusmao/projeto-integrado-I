// Ícones de traço simples, no lugar dos emojis (que mudam de cara em cada sistema).
const Base = ({ children, className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {children}
  </svg>
)

export const IconeBusca = (p) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>
)
export const IconeEtiqueta = (p) => (
  <Base {...p}><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" /><circle cx="8" cy="8" r="1.5" /></Base>
)
export const IconeNota = (p) => (
  <Base {...p}><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" /><path d="M9 7h6M9 11h6M9 15h4" /></Base>
)
export const IconeLista = (p) => (
  <Base {...p}><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Base>
)
export const IconeMais = (p) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
)
export const IconeLixeira = (p) => (
  <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Base>
)
export const IconeLapis = (p) => (
  <Base {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></Base>
)
export const IconeImpressora = (p) => (
  <Base {...p}><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="1" /><path d="M7 14h10v7H7z" /></Base>
)
export const IconeBaixar = (p) => (
  <Base {...p}><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></Base>
)
export const IconeVoltar = (p) => (
  <Base {...p}><path d="M15 18l-6-6 6-6" /></Base>
)
