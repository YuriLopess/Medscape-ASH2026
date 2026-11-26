import { Media } from './Media.jsx';
import { Play } from './Icons.jsx';
import { useContent } from '../i18n.jsx';
import { trackCard } from '../analytics.js';

/*
  "Destaques da cobertura": o primeiro vídeo da lista em capa grande (título sobre a imagem, como um player), os outros
  três numa lista ao lado (embaixo, no celular). Nada de etiqueta sobre as imagens: estado e natureza do conteúdo ficam
  numa linha discreta sob o título de cada vídeo (a natureza aparece antes do clique, como pede o handoff).
*/

// "● Em breve · Conteúdo patrocinado" ou "▶ Assistir · 06:12 · Conteúdo patrocinado"
export function Meta({ item }) {
  const { ui } = useContent();
  return (
    <span className="fv-meta">
      {item.upcoming ? (
        <span className="fv-meta-state"><span className="fv-meta-dot" aria-hidden="true" />{ui.soon}</span>
      ) : (
        <span className="fv-meta-state"><Play aria-hidden="true" />{ui.watchNow}{item.duration && ` · ${item.duration}`}</span>
      )}
      <span>{item.sponsor ? ui.sponsoredBadge : ui.editorial}</span>
    </span>
  );
}

function Feature({ item }) {
  return (
    <a className="fv-feature" href={item.href} onClick={() => trackCard(item, 0, 'destaques')}>
      <Media src={item.image} focus={item.focus} eager className="fv-feature-media" sizes="(max-width: 1000px) 92vw, 760px">
        <span className="fv-feature-shade" aria-hidden="true" />
        {!item.upcoming && <span className="fv-play fv-play--large" aria-hidden="true"><Play /></span>}
        <span className="fv-feature-body">
          <span className="fv-feature-title">{item.title}</span>
          {item.description && <span className="fv-feature-text">{item.description}</span>}
          <Meta item={item} />
        </span>
      </Media>
    </a>
  );
}

function Row({ item, index }) {
  return (
    <li>
      <a className="fv-row" href={item.href} onClick={() => trackCard(item, index, 'destaques')}>
        <Media src={item.image} focus={item.focus} eager className="fv-row-media" sizes="(max-width: 640px) 40vw, (max-width: 1000px) 32vw, 230px">
          {!item.upcoming && <span className="fv-play" aria-hidden="true"><Play /></span>}
        </Media>
        <span className="fv-row-body">
          <span className="fv-row-title">{item.title}</span>
          {item.description && <span className="fv-row-text">{item.description}</span>}
          <Meta item={item} />
        </span>
      </a>
    </li>
  );
}

export default function FeaturedVideos() {
  const { featuredVideos, ui } = useContent();
  const [main, ...rest] = featuredVideos;
  if (!main) return null;

  return (
    <section id="destaques" data-reveal className="section fv" aria-labelledby="destaques-title">
      <div className="container">
        <header className="fv-head">
          <h2 id="destaques-title" className="section-title">{ui.featuredTitle}</h2>
          <p className="fv-lead">{ui.featuredLead}</p>
        </header>
        <div className="fv-grid">
          {/* Títulos dos vídeos como h3, para leitores de tela navegarem pela lista */}
          <article className="fv-main" aria-labelledby={`fv-${main.id}`}>
            <h3 id={`fv-${main.id}`} className="sr-only">{main.title}</h3>
            <Feature item={main} />
          </article>
          <ul className="fv-list">
            {rest.map((video, i) => <Row key={video.id} item={video} index={i + 1} />)}
          </ul>
        </div>
      </div>
    </section>
  );
}
