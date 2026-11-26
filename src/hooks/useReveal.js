import { useEffect } from 'react';

// Revela suavemente os elementos marcados com data-reveal (o bloco inteiro) ou data-stagger (os itens da lista,
// um depois do outro) quando entram na tela, uma vez só.
// Roda de novo a cada troca de página (dep), para pegar os elementos da página nova.
// Sem IntersectionObserver ou com "reduzir movimento" ativado, mostra tudo direto.
export function useReveal(dep, anchor = null) {
  useEffect(() => {
    // data-draw: só marca a hora de desenhar as linhas (motion.css), sem esconder o bloco como data-reveal
    const els = [...document.querySelectorAll('[data-reveal]:not(.is-revealed), [data-stagger]:not(.is-revealed), [data-draw]:not(.is-revealed)')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    // Seção que já está na tela quando a página abre: ganha is-early, e o CSS (motion.css) atrasa a entrada dela até o
    // banner terminar a dele. Sem isso as duas animações rodam juntas e a da seção passa despercebida.
    // Entrada direto numa seção (anchor: #destaques, #/videos): ela é a primeira coisa na tela, então não espera o banner
    // (que nem está visível) e entra num ritmo mais curto (is-target). As outras seções não ganham atraso.
    const start = performance.now();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (anchor) {
            if (entry.target.id === anchor) entry.target.classList.add('is-target');
          } else if (performance.now() - start < 600) {
            entry.target.classList.add('is-early');
          }
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}
