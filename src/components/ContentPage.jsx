import { Meta } from './FeaturedVideos.jsx';
import { ArrowLeft, Play } from './Icons.jsx';
import Breadcrumb from './Breadcrumb.jsx';
import ReturnBand from './ReturnBand.jsx';
import Disclosure from './Disclosure.jsx';
import NotFound from './NotFound.jsx';
import ShareBar from './ShareBar.jsx';
import { About, TranscriptDownload } from './VideoTabs.jsx';
import { Media, srcSet } from './Media.jsx';
import { POST } from '../data/content.js';
import { useContent } from '../i18n.jsx';
import { trackCard } from '../analytics.js';

// Player: usa o vídeo hospedado no próprio site (videoSrc). Sem arquivo ainda, a capa mostra "Em breve" (e a data
// prevista, se houver), em vez de um botão de play que não faz nada. No Pós-ASH, a frase do briefing já está na
// abertura: aqui o quadro diz quando o conteúdo chega (depois do último dia do congresso).
function VideoPlayer({ item }) {
  const { event, page, ui } = useContent();

  if (item.videoSrc) {
    return (
      <div className="cp-player">
        <video controls preload="none" poster={item.image} src={item.videoSrc}>
          {item.captionsSrc && <track kind="captions" srcLang="pt" label="Português" src={item.captionsSrc} default />}
        </video>
      </div>
    );
  }

  const isPost = item.topic === POST;
  return (
    <div className="cp-player cp-player--soon">
      <Media src={item.image} focus={item.focus} eager className="cp-player-media">
        <div className="cp-player-soon">
          <span className="soon-badge soon-badge--large">
            <span className="soon-dot" aria-hidden="true" />
            {ui.soon}
          </span>
          {!isPost && item.dateLabel && <p className="cp-player-soon-date">{ui.soonExpected(item.dateLabel)}</p>}
          <p className="cp-player-soon-note">{isPost ? page.postSoonNote(event.name, event.endLabel) : page.videoSoon}</p>
        </div>
      </Media>
    </div>
  );
}

// Largura da arte do topo: ~46% da janela no computador. No celular ela aparece com até 520 px, mas aqui
// vai menos de propósito: é decorativa, e assim telas de alta resolução baixam a versão de 960 px, não o
// original. Igual em vite.config.js (artPreload).
const ART_SIZES = '(max-width: 900px) 100vw, 1100px';

/*
  Página de um vídeo: abertura, vídeo em destaque, compartilhamento e abas (transcrição / Sobre o vídeo).
  heading: título da página quando não é o do vídeo (Pós-ASH).
*/
export default function ContentPage({ item, heading }) {
  const { event, page, relatedContent, ui } = useContent();
  if (!item) return <NotFound />;

  const isPost = item.topic === POST;
  const related = isPost ? [] : relatedContent(item);
  const summary = isPost && item.upcoming ? page.postSoon : item.summary;
  // Ficha do vídeo na lateral (duração entra quando o vídeo é publicado)
  const facts = [
    [page.event, event.name],
    [page.place, event.city],
    [page.dates, event.dates],
    [ui.duration, item.duration],
    [page.format, page.formatValue],
  ].filter(([, value]) => value);

  return (
    <article className="cp">
      <header className="cp-hero">
        <div className="container cp-hero-inner">
          {/* Só no celular: aviso obrigatório no topo da página */}
          <Disclosure />
          <div className="cp-hero-text">
            <Breadcrumb topic={item.topic} />
            {/* Conteúdo patrocinado: aviso com a logo da empresa acima do título (handoff, pág. 10) */}
            {item.sponsorInfo && (
              <div className="cp-disclosure">
                <span className="cp-disclosure-label">{page.sponsoredBy}</span>
                {item.sponsorInfo.logo ? (
                  <img
                    className="cp-disclosure-logo"
                    src={item.sponsorInfo.logo}
                    alt={item.sponsorInfo.name}
                    style={{ '--logo-h': `${Math.round((item.sponsorInfo.logoHeight ?? 48) * 0.6)}px` }}
                  />
                ) : (
                  <strong>{item.sponsorInfo.name}</strong>
                )}
              </div>
            )}
            <h1 className="cp-title">{heading ?? item.title}</h1>
            <p className="cp-byline">{item.dateLabel ? page.byline(event.name, item.dateLabel) : ui.coverageOf(event.name)}</p>
            {/* No Pós-ASH ainda sem vídeo, a frase do briefing ("Conteúdo disponível após o congresso.") é o texto de apoio,
                no mesmo formato das páginas de vídeo */}
            {summary && <p className="cp-summary">{summary}</p>}
          </div>
          {/* Imagem de fundo da abertura, encostada à direita; à esquerda, o fundo continua na cor da borda dela.
              Igual em todas as páginas internas */}
          {event.contentArt && (
            <div className="cp-hero-art" aria-hidden="true">
              {/* WebP primeiro, igual ao preload do <head> (vite.config.js): sem ele o navegador baixava o JPEG
                  também, e a arte vinha duas vezes */}
              <picture>
                <source type="image/webp" srcSet={srcSet(event.contentArt, 'webp')} sizes={ART_SIZES} />
                <img
                  src={event.contentArt}
                  srcSet={srcSet(event.contentArt)}
                  sizes={ART_SIZES}
                  alt=""
                  width="2172"
                  height="724"
                  fetchPriority="high"
                />
              </picture>
            </div>
          )}
        </div>
      </header>

      {/* Duas colunas: à esquerda o vídeo e "Sobre o vídeo"; à direita, compartilhar, a ficha do vídeo e a transcrição em PDF,
          parados no lugar. No celular: vídeo, lateral, "Sobre o vídeo".
          Sem data-reveal no texto: um texto longo nunca teria a fração visível que dispara a animação */}
      <div className="container vp-layout">
        <section data-reveal className="vp-player" aria-label={ui.video}>
          <VideoPlayer item={item} />
        </section>
        <aside data-reveal className="vp-aside">
          <ShareBar item={item} title={heading && item.upcoming ? heading : item.title} />
          <dl className="vp-facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <TranscriptDownload item={item} />
        </aside>
        <div data-draw className="vp-about"><About item={item} /></div>
      </div>

      {/* Outros vídeos no mesmo desenho da lista de destaques da Home (capa, título, texto e a linha "Em breve ·
          Conteúdo patrocinado"), com o retorno à cobertura no cabeçalho */}
      {related.length > 0 ? (
        <section data-reveal className="cp-more" aria-labelledby="cp-related-title">
          <div className="container">
            <header className="cp-more-head">
              <div>
                <h2 id="cp-related-title" className="section-title">{page.related}</h2>
                <p className="cp-more-lead">{page.relatedSub(event.name)}</p>
              </div>
              <a className="cp-more-back" href="#destaques"><ArrowLeft /> {page.back}</a>
            </header>
            <ul className="cp-more-list">
              {related.map((r, i) => (
                <li key={r.id}>
                  <a className="cp-more-item" href={r.href} onClick={() => trackCard(r, i, 'relacionados')}>
                    <Media src={r.image} focus={r.focus} className="cp-more-media" sizes="(max-width: 640px) 40vw, (max-width: 900px) 32vw, 340px">
                      {!r.upcoming && <span className="fv-play" aria-hidden="true"><Play /></span>}
                    </Media>
                    <span className="cp-more-body">
                      <span className="cp-more-title">{r.title}</span>
                      {r.description && <span className="cp-more-text">{r.description}</span>}
                      <Meta item={r} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        // Sem relacionados (Pós-ASH): retorno explícito aos destaques, sem depender do Voltar do navegador
        <ReturnBand />
      )}
    </article>
  );
}
