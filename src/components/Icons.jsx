const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const ArrowRight = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const User = (p) => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...p}>
    <circle cx="12" cy="8.5" r="4" fill="currentColor" />
    <path fill="currentColor" d="M4 20.5c0-4.2 3.6-7 8-7s8 2.8 8 7z" />
  </svg>
);
export const ChevronLeft = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M15 6l-6 6 6 6" /></svg>
);
export const ChevronRight = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M9 6l6 6-6 6" /></svg>
);
export const ChevronDown = (p) => (
  <svg viewBox="0 0 24 24" width="14" height="14" {...base} {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const Clock = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
// Dois balões de conversa (Síntese final: as duas conversas de encerramento)
export const Chat = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}><path d="M4 5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" /><path d="M16 9h4a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1v3l-4-3h-4a1 1 0 0 1-1-1v-1" /></svg>
);
export const Search = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
export const Pin = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);
export const Play = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...p}><path fill="currentColor" d="M8 5.5v13l11-6.5z" /></svg>
);
export const Doc = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
export const Menu = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Close = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Mail = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
);
export const Download = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...p}><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" /></svg>
);
export const WhatsApp = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...p}>
    <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);
export const Calendar = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 2.5V7M16 2.5V7" /></svg>
);
export const Experts = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth="1.6" {...p}>
    <circle cx="12" cy="8" r="3.2" /><path d="M5.8 19.5c0-3.6 2.6-6 6.2-6s6.2 2.4 6.2 6z" />
    <path d="M6.6 11.6a2.4 2.4 0 1 1 .6-4.6M1.8 17.2c0-2 1-3.6 2.7-4.3M17.4 11.6a2.4 2.4 0 1 0-.6-4.6M22.2 17.2c0-2-1-3.6-2.7-4.3" />
  </svg>
);
export const ClipboardCheck = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth="1.6" {...p}>
    <path d="M9 4.5H6.5a1.5 1.5 0 0 0-1.5 1.5v13.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H15" />
    <rect x="9" y="2.8" width="6" height="3.6" rx="1" /><path d="M8.8 14l2.3 2.3 4.4-4.8" />
  </svg>
);
export const VideoFrame = (p) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} strokeWidth="1.6" {...p}><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="M10 9v6l5-3z" /></svg>
);
