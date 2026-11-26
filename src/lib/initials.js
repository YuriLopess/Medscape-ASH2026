// Iniciais para o avatar quando não há foto ("Dra. Ana Souza" → "AS")
export const initials = (name) =>
  name
    .replace(/^(dra?|prof(a|\.)?)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .join('')
    .toUpperCase();
