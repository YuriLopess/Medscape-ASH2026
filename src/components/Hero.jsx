import { ArrowRight, Pin } from './Icons.jsx';
import Disclosure from './Disclosure.jsx';
import { Media } from './Media.jsx';
import { useContent } from '../i18n.jsx';

// Frente da Home: banner no padrão das coberturas (evento, data e cidade, chamada, botão). Estilos em front.css.
export default function Hero() {
  const { event, ui } = useContent();

  return (
    <section className="front" aria-labelledby="front-title">
        <Media src={event.heroImage} alt={event.heroAlt} className="front-media" priority />
        {/* Mesmo quadro da foto (1914 × 942, alinhado à direita): a fita contorna a ponta da cidade em qualquer largura, e a
            máscara da foto (front.css) segue a mesma curva */}
        <svg className="front-arcs" viewBox="0 0 1914 942" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="front-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="942">
              <stop offset="0" stopColor="#0f9ed5" stopOpacity=".25" />
              <stop offset=".22" stopColor="#0f9ed5" />
              <stop offset=".58" stopColor="#4b8de6" />
              <stop offset=".84" stopColor="#e2508f" />
              <stop offset="1" stopColor="#ff5a70" stopOpacity=".35" />
            </linearGradient>
            <linearGradient id="front-band" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="942">
              <stop offset="0" stopColor="#0f9ed5" stopOpacity=".05" />
              <stop offset=".4" stopColor="#2f9fe6" stopOpacity=".26" />
              <stop offset=".66" stopColor="#4a5fe0" stopOpacity=".28" />
              <stop offset="1" stopColor="#a02b93" stopOpacity=".42" />
            </linearGradient>
            {/* Desfoque das bordas da faixa: ela se dissolve no azul e na foto, sem corte seco */}
            <filter id="front-soft" x="-50%" y="-10%" width="200%" height="120%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>
          <path className="front-arcs-band" filter="url(#front-soft)" d="M776 -30 C 648 170, 622 470, 716 674 C 764 778, 838 878, 930 985 L1000 985 C 898 866, 812 758, 764 652 C 678 462, 704 172, 834 -30 Z" />
          {/* Halo e linha, nas duas bordas */}
          <path stroke="url(#front-line)" strokeWidth="9" strokeOpacity=".16" d="M776 -30 C 648 170, 622 470, 716 674 C 764 778, 838 878, 930 985" />
          <path stroke="url(#front-line)" strokeWidth="9" strokeOpacity=".16" d="M834 -30 C 704 172, 678 462, 764 652 C 812 758, 898 866, 1000 985" />
          <path stroke="url(#front-line)" strokeWidth="1.75" d="M776 -30 C 648 170, 622 470, 716 674 C 764 778, 838 878, 930 985" />
          <path stroke="url(#front-line)" strokeWidth="1.75" d="M834 -30 C 704 172, 678 462, 764 652 C 812 758, 898 866, 1000 985" />
        </svg>
        {/* Só no celular: aviso obrigatório em selo de vidro no alto da imagem */}
        <div className="container front-disclosure"><Disclosure variant="dark" /></div>

        <div className="container front-inner">
          <div className="front-text">
            <p className="front-event">{event.name}</p>
            {/* Edição sem data confirmada (data/edition.js): a linha não aparece */}
            {event.dates && (
              <p className="front-dates"><span>{event.dates}</span> <i aria-hidden="true">•</i> <span>{event.city}</span></p>
            )}
            <h1 id="front-title" className="front-title">
              <span>{event.title[0]}</span> <span>{event.title[1]}</span>
            </h1>
            <p className="front-lead">{event.lead}</p>
            <a className="btn btn--light" href="#destaques">{ui.exploreCoverage} <ArrowRight /></a>
            <p className="front-meta">
              {event.city && (
                <>
                  <span className="front-meta-city"><Pin aria-hidden="true" /> {event.city}</span>
                  <span className="front-meta-divider" aria-hidden="true" />
                </>
              )}
              <span>{event.tagline}</span>
            </p>
          </div>
        </div>
    </section>
  );
}
