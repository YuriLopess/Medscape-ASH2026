import Disclosure from './Disclosure.jsx';
import { ArrowRight } from './Icons.jsx';
import { useContent } from '../i18n.jsx';

// Link quebrado ou conteúdo ainda não publicado: oferece a volta para a Home e para os destaques.
export default function NotFound() {
  const { page, ui } = useContent();

  return (
    <article className="nf">
      <header className="nf-hero">
        <div className="container nf-hero-inner">
          <div className="nf-hero-text">
            <Disclosure />
            <h1 className="lp-title">{page.notFound}</h1>
            <p className="nf-text">{page.notFoundText}</p>
            <div className="nf-actions">
              <a className="btn btn--dark" href="#/">{page.notFoundBack} <ArrowRight /></a>
              <a className="btn btn--outline" href="#destaques">{ui.featuredTitle}</a>
            </div>
          </div>
          {/* Número decorativo, só no desktop */}
          <p className="nf-code" aria-hidden="true">404</p>
        </div>
      </header>
    </article>
  );
}
