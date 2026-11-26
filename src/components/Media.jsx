import { useState } from 'react';
import { Play } from './Icons.jsx';
import { useContent } from '../i18n.jsx';
import variants from '../data/image-variants.json';
import placeholders from '../data/image-placeholders.json';

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
// priority: imagem principal da página, acima da dobra: carrega na hora, com prioridade alta
// eager: aparece logo na primeira tela, mas não é a principal: carrega na hora, sem furar a fila do banner
// Enquanto a foto chega, uma prévia minúscula dela (image-placeholders.json, gerada pelo mesmo script) aparece desfocada
// no lugar: a imagem nunca começa vazia. Quando a foto termina de carregar, entra por cima num fade curto.
export function Media({ src, alt = '', className = '', focus, sizes, priority = false, eager = false, children }) {
  const { event } = useContent();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ph = src && placeholders[src.split('?')[0]];
  // Foto que já estava no cache termina antes do onLoad ser ligado: confere ao montar
  const checkDone = (img) => { if (img?.complete && img.naturalWidth) setLoaded(true); };

  return (
    <div className={`media ${className}${ph ? ' has-ph' : ''}${loaded ? ' is-loaded' : ''}`}>
      {ph && !failed && (
        <span className="media-ph" aria-hidden="true" style={{ backgroundImage: `url(${ph})`, ...(focus ? { backgroundPosition: focus } : null) }} />
      )}
      {src && !failed ? (
        // WebP primeiro (bem mais leve); o JPEG fica de reserva para navegadores sem suporte
        <picture>
          {variants[src] && <source type="image/webp" srcSet={srcSet(src, 'webp')} sizes={sizes ?? SIZES[className]} />}
          <img
            src={src}
            srcSet={srcSet(src)}
            sizes={sizes ?? SIZES[className]}
            alt={alt}
            ref={checkDone}
            onLoad={() => setLoaded(true)}
            loading={priority || eager ? 'eager' : 'lazy'}
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
