import { Mail, WhatsApp } from './Icons.jsx';
import { useContent } from '../i18n.jsx';
import { track } from '../analytics.js';

// Compartilhar por e-mail e WhatsApp. São só links (mailto: e wa.me): nenhum script de terceiros é carregado.
// O endereço é montado sem os parâmetros da URL atual, para não levar junto o código de acesso do banner.
export default function ShareBar({ item, title }) {
  const { event, lang, page } = useContent();
  const { origin, pathname } = window.location;
  const url = `${origin}${pathname}${lang === 'pt' ? '' : `?lang=${lang}`}${item.href}`;
  const text = page.shareText(title, event.name);
  const onShare = (canal) => () => track('share', { canal, tema: item.topic, slug: item.slug ?? item.topic });

  return (
    <div className="share" role="group" aria-label={page.share}>
      <p className="share-label">{page.share}</p>
      <a
        className="share-btn"
        href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`}
        aria-label={page.shareEmailLabel}
        onClick={onShare('email')}
      >
        <Mail /> {page.shareEmail}
      </a>
      <a
        className="share-btn"
        href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={page.shareWhatsappLabel}
        onClick={onShare('whatsapp')}
      >
        <WhatsApp /> {page.shareWhatsapp}
      </a>
    </div>
  );
}
