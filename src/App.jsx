import { useEffect } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import HomePage from './components/HomePage.jsx';
import ContentPage from './components/ContentPage.jsx';
import NotFound from './components/NotFound.jsx';
import { useContent } from './i18n.jsx';
import { useRoute } from './hooks/useRoute.js';
import { useReveal } from './hooks/useReveal.js';
import { trackRoute } from './analytics.js';
import { EVENT_NAME } from './data/edition.js';

const SITE_TITLE = `${EVENT_NAME} · Medscape`;

export default function App() {
  const route = useRoute();
  const { event, getContent, page, postContent, ui } = useContent();

  const item = route.page === 'content' ? getContent(route.topic, route.slug) : route.page === 'post' ? postContent : null;

  // Identidade da rota: reinicia as animações de entrada e dispara o evento de página
  const routeKey = [route.page, route.topic, route.slug].filter(Boolean).join(':');
  useReveal(routeKey);

  useEffect(() => {
    const titles = { content: item?.title, post: page.postTitle(event.name) };
    const name = route.page === 'home' ? null : titles[route.page] ?? page.notFound;
    document.title = name ? `${name} · ${SITE_TITLE}` : SITE_TITLE;
    trackRoute(route, item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  function currentPage() {
    switch (route.page) {
      case 'content':
        return <ContentPage key={routeKey} item={item} />;
      case 'post':
        return <ContentPage key={routeKey} item={item} heading={page.postTitle(event.name)} />;
      case 'notFound':
        return <NotFound />;
      default:
        return <HomePage />;
    }
  }

  return (
    <>
      <a className="skip" href="#conteudo">{ui.skip}</a>
      <SiteHeader />
      {/* key: cada rota remonta a página, então a animação de entrada roda a cada navegação */}
      <main id="conteudo" key={routeKey}>{currentPage()}</main>
      <SiteFooter />
    </>
  );
}
