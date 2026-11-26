import { useState } from 'react';
import { Play } from './Icons.jsx';
import { useContent } from '../i18n.jsx';
import variants from '../data/image-variants.json';

/*
  Largura em que cada tipo de imagem aparece na tela. Com isso o navegador escolhe, entre as versões
  geradas por scripts/gerar-variantes.py (480, 720, 960, 1280 px e o original), a menor que fica nítida —
  inclusive em telas de alta resolução.
  Atenção ao recorte: quando o quadro é mais alto que a proporção da foto (banner no celular, cards de área),
  o object-fit: cover amplia a foto além da largura do quadro. O valor aqui é a largura da foto ampliada,
  senão ela chega pequena e fica borrada.
*/
const SIZES = {
  'front-media': '(max-width: 640px) 170vw, (max-width: 900px) 135vw, (max-width: 1280px) 100vw, 88vw',
  'area-media': '(max-width: 640px) 90vw, (max-width: 900px) 60vw, 520px',
  'card-media': '(max-width: 640px) 90vw, 440px',
  'tx-lead-media': '(max-width: 720px) 100vw, 420px',
  'tx-thumb': '90px',
  'nf-area-media': '76px',
  'se-thumb': '124px',
  'sy-video-media': '(max-width: 640px) 136px, 600px',
  'tp-highlight-media': '(max-width: 900px) 100vw, 620px',
  'cp-player-media': '(max-width: 1280px) 100vw, 1200px',
};

// ext: 'jpg' ou 'webp' (o script gera os dois formatos para cada tamanho; artes com transparência só
// existem em WebP)
export function srcSet(src, ext = src.endsWith('.webp') ? 'webp' : 'jpg') {
  const widths = variants[src];
  if (!widths) return undefined; // foto sem versões menores: usa só o original
  const original = widths[widths.length - 1];
  return widths
    .map((w) => `${src.replace(/\.(jpg|webp)$/, w === original ? `.${ext}` : `-${w}.${ext}`)} ${w}w`)
    .join(', ');
}

// Imagem com placeholder: se o arquivo ainda não existir em /public, mostra um fundo da marca.
// focus: ponto que o recorte automático preserva (CSS object-position), ex.: 'center 30%'
// sizes: tamanho em que a imagem aparece, quando foge do padrão do tipo (ver SIZES)
// priority: imagem principal da página, acima da dobra: carrega na hora, sem lazy loading
export function Media({ src, alt = '', className = '', focus, sizes, priority = false, children }) {
  const { event } = useContent();
  const [failed, setFailed] = useState(false);

  return (
    <div className={`media ${className}`}>
      {src && !failed ? (
        // WebP primeiro (bem mais leve); o JPEG fica de reserva para navegadores sem suporte
        <picture>
          {variants[src] && <source type="image/webp" srcSet={srcSet(src, 'webp')} sizes={sizes ?? SIZES[className]} />}
          <img
            src={src}
            srcSet={srcSet(src)}
            sizes={sizes ?? SIZES[className]}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            style={focus ? { objectPosition: focus } : undefined}
            onError={() => setFailed(true)}
          />
        </picture>
      ) : (
        <div className="media-placeholder" aria-hidden="true"><span>{event.name}</span></div>
      )}
      {children}
    </div>
  );
}

export function PlayBadge({ large = false }) {
  return (
    <span className={`play-badge${large ? ' play-badge--large' : ''}`} aria-hidden="true">
      <Play />
    </span>
  );
}

// Conteúdo ainda não publicado: "● Em breve" no lugar do botão de play (date opcional: "Em breve · 24 out")
export function SoonBadge({ date, large = false }) {
  const { ui } = useContent();
  return (
    <span className={`soon-badge${large ? ' soon-badge--large' : ''}`}>
      <span className="soon-dot" aria-hidden="true" />
      {ui.soon}
      {date && ` · ${date}`}
    </span>
  );
}

export function Duration({ children }) {
  const { ui } = useContent();
  return <span className="duration"><span className="sr-only">{ui.duration} </span>{children}</span>;
}
