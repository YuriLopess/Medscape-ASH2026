/*
  Edição da cobertura. Trocar o número aqui muda o nome do evento no site inteiro (textos, títulos das páginas,
  tela de cadastro e prévia de compartilhamento). Arquivo sem dependências: também é lido por vite.config.js e pela
  tela pública de cadastro.
*/
export const EDITION = 2026;
export const EVENT_NAME = `ASH ${EDITION}`;

// Dias do congresso, por edição (a data e a cidade escritas ficam em locales/<idioma>.js → editions).
// Edição sem datas confirmadas: o site não mostra data nem cidade.
const datesByEdition = {
  2026: { start: '2026-12-12', end: '2026-12-15' },
};
export const eventDates = datesByEdition[EDITION] ?? null;
