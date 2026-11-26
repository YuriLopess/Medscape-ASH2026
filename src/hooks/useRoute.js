import { useEffect, useState } from 'react';
import { POST, SYNTHESIS, VIDEOS } from '../data/content.js';

/*
  Roteamento por hash, sem dependências, que funciona em qualquer hospedagem estática
  (inclusive abrindo o site de uma pasta):

    #/                  Home
    #destaques          Home, na seção "Destaques da cobertura"
    #/videos/<slug>     Página de um vídeo
    #/pos-ash           Pós-ASH

  Qualquer outro endereço cai em "conteúdo não encontrado". Os caminhos de áreas, notícias, Síntese final e busca
  (cobertura do ESMO) não existem nesta cobertura; os *Href deles abaixo servem só aos componentes que ficaram fora do ar.
*/

export const homeHref = '#/';
export const synthesisHref = `#/${SYNTHESIS}`;
export const topicHref = (topic) => `#/${topic}`;
export const listingHref = (format, topic) => `#/${format}${topic ? `?tema=${topic}` : ''}`;
export const searchHref = (q) => `#/busca${q ? `?q=${encodeURIComponent(q)}` : ''}`;

function parse(hash) {
  // Só tratamos como rota o que começa com "#/"; "#secao" continua sendo âncora na página atual
  if (!hash.startsWith('#/')) return null;
  const [path] = hash.slice(2).split('?');
  const [first, second] = path.split('/').filter(Boolean).map(decodeURIComponent);

  if (!first) return { page: 'home' };
  if (first === POST && !second) return { page: 'post' };
  // A lista de vídeos é a própria seção da Home
  if (first === VIDEOS) return second ? { page: 'content', topic: VIDEOS, slug: second } : { page: 'home', anchor: 'destaques' };
  return { page: 'notFound' };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash) ?? { page: 'home', anchor: window.location.hash.slice(1) });

  useEffect(() => {
    const onHashChange = () => {
      const next = parse(window.location.hash);
      if (next) {
        setRoute(next);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      // Âncora de uma seção: rola até ela se existir nesta página, senão volta para a Home
      const anchor = window.location.hash.slice(1);
      if (anchor && !document.getElementById(anchor)) setRoute({ page: 'home', anchor });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Depois de voltar para a Home, rola até a seção pedida
  useEffect(() => {
    if (route.page === 'home' && route.anchor) {
      requestAnimationFrame(() => document.getElementById(route.anchor)?.scrollIntoView());
    }
  }, [route]);

  return route;
}
