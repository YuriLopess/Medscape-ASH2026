// Estrutura do conteúdo do site (ids, patrocinador, durações, imagens). A cobertura tem 4 vídeos na Home
// (Destaques da cobertura) e um na página Pós-ASH.
// Imagens: coloque os arquivos em /public/images e rode python scripts/gerar-variantes.py; enquanto não existirem,
// o site mostra um placeholder no lugar.
//
// Os textos de cada idioma ficam em ./locales (pt.js, es.js, en.js), todos com a mesma estrutura.
import pt from './locales/pt.js';
import es from './locales/es.js';
import en from './locales/en.js';
import { EDITION, EVENT_NAME, eventDates } from './edition.js';
import { highlights } from './highlights.js';
import { transcripts } from './transcripts.js';
import variants from './image-variants.json';

export const locales = { pt, es, en };
export const defaultLang = 'pt';

// Imagens fixas do site: só entram quando o arquivo existir e tiver passado por scripts/gerar-variantes.py
const ifReady = (src) => (variants[src] ? src : null);

const eventBase = {
  name: EVENT_NAME, // edição: ./edition.js
  start: eventDates?.start ?? null,
  end: eventDates?.end ?? null,
  heroImage: ifReady('images/hero.jpg'),
  // Fundo da abertura das páginas internas (fita de sangue sobre lavanda; a metade esquerda é lisa, para o texto)
  contentArt: ifReady('images/cobertura-arte.jpg'),
};

// Empresa que solicita a cobertura: patrocina todos os vídeos e assina o cabeçalho (à direita) e o rodapé.
// Sem logo, aparece o nome. ?v=1: a Cloudflare guarda imagens por 7 dias; ao trocar o arquivo, suba o número.
const SPONSOR = 'AstraZeneca';
const partnerLogo = 'images/logos/astrazeneca.png?v=2';

/*
  Áreas terapêuticas: a descoberta principal do site, nesta ordem; cada uma tem página própria em #/<id>.
  Os ids viram a URL: troque 'area-1' etc. pelos nomes definitivos (aqui e em locales/<idioma>.js → topics).
  O layout da Home é feito para 6 áreas (2 grandes e 4 menores). "outros" tem botões de filtro (topicSubtopics).
*/
// A cobertura do ASH não tem áreas (são só 4 vídeos): lista vazia, sem páginas de área.
const topicIds = [];

// Foto de capa de cada área no "Explore por área terapêutica". Ex.: { 'area-1': 'images/areas/area-1.jpg' }
const topicCovers = {};

/*
  Especialistas dos vídeos: foto e cargo. Os vídeos citam a pessoa pelo nome; qualquer um dos nomes da lista liga
  o vídeo à foto e ao cargo. Cargo em locales/<idioma>.js → people[id].
  Fotos em public/images/comite/ (comitê da área) e public/images/especialistas/ (demais).
  Ex.: { id: 'nome-sobrenome', photo: 'images/comite/nome-sobrenome.jpg?v=1', names: ['Dra. Nome Sobrenome'] }
*/
const people = [];
const personByName = new Map(people.flatMap((p) => p.names.map((n) => [n, p])));

// Comitê científico de cada área: aparece ao lado do conteúdo principal na página da área. Fotos: salvar em
// public/images/comite/ com o nome de arquivo indicado (.jpg, quadradas, 360 px ou mais). Enquanto o arquivo não
// existir, aparecem as iniciais da pessoa. ?v=1: a Cloudflare guarda imagens por 7 dias; ao trocar uma foto, suba o número.
// Ex.: { 'area-1': [{ name: 'Dra. Nome Sobrenome', photo: 'images/comite/nome-sobrenome.jpg?v=1' }] }
const topicCommittee = {};

// Especialidades de cada área que tem botões de filtro (só "Outros temas"). Para um conteúdo aparecer num
// filtro, inclua subtopic: '<chave>' no item (ex.: { id: ..., topic: 'outros', subtopic: 'tema-1', ... }).
// Nomes em locales/<idioma>.js → subtopics.
const topicSubtopics = { outros: ['tema-1', 'tema-2', 'tema-3'] };

/*
  Conteúdo principal da área: o patrocinado tem prioridade;
  sem patrocinado, o primeiro que subir na página (ordem das listas acima). Enquanto nada estiver publicado,
  vale a mesma regra entre os previstos. items: na ordem das listas.
*/
export function pickHighlight(items) {
  const published = items.filter((c) => !c.upcoming);
  const pool = published.length > 0 ? published : items;
  return pool.find((c) => c.sponsored) ?? pool[0] ?? null;
}

// Rotas: #/videos/<slug> (os 4 vídeos da Home) e #/pos-ash
export const VIDEOS = 'videos';
export const POST = 'pos-ash';

// Rota da Síntese final (fora do ar nesta cobertura); também é o "tema" na URL dos dois vídeos de encerramento
export const SYNTHESIS = 'sintese-final';

/*
  Vídeos curtos (highlights) → "Destaques da cobertura" e listagem de vídeos
  Vídeos finais              → página "Síntese final"
  Notícias                   → listagem de notícias

  sponsor: nome da empresa patrocinadora (deve existir em "supporters", com logo). Sem sponsor = editorial.
  slug:    parte final da URL (#/<tema>/<slug>). Fica em português nos três idiomas, para o link não quebrar
           quando a pessoa troca de idioma.
  date:    data de publicação (ISO). Ordena as listagens e aparece na página do conteúdo.
  focus (opcional): parte da imagem que deve ficar visível quando o card recorta a foto, ex.: 'center 15%'
  Título e descrição de cada item ficam em locales/<idioma>.js → content[id].
*/

/*
  Os 4 vídeos da Home, nesta ordem: o primeiro aparece grande, os outros três menores. Título e texto de apoio em
  locales/<idioma>.js → content[id]; transcrição em transcripts.js. Sem videoSrc, o vídeo aparece como "Em breve".
  Ao publicar, troque a lista gerada por itens assim:
    { id: 'video-1', topic: VIDEOS, slug: 'titulo-do-video', sponsor: SPONSOR, date: 'AAAA-MM-DD', duration: '05:40',
      image: 'images/videos/video-1.jpg', videoSrc: 'videos/video-1.mp4',
      speakers: [{ name: 'Dra. Nome Sobrenome' }] }
  Especialistas: foto em people (acima); especialidade, cargo, minicurrículo e conflitos em locales → people[id].
  Depois de adicionar ou trocar fotos, rode: python scripts/gerar-variantes.py
*/
// Ponto da capa que o recorte dos cards menores preserva
const COVER_FOCUS = { 2: '72% 50%', 3: '40% 50%' };
const featuredBase = [1, 2, 3, 4].map((n) => ({
  id: `video-${n}`,
  topic: VIDEOS,
  slug: `video-${n}`,
  sponsor: SPONSOR,
  image: ifReady(`images/videos/video-${n}.jpg`),
  focus: COVER_FOCUS[n],
}));

// Vídeo da página Pós-ASH (#/pos-ash): mesma estrutura; fica fora da Home e dos relacionados
const postBase = { id: POST, topic: POST, sponsor: SPONSOR, image: ifReady('images/videos/pos-ash.jpg') };

// Vídeos finais. O "tema" na URL é a própria Síntese final.
const finalBase = [];

/*
  "ASH pelo olhar dos associados" (Home): fotos e vídeos dos associados, num feed no estilo do Instagram (grade quadrada, abas Todos/Fotos/Vídeos, post aberto numa janela).
  Conteúdo real, na ordem em que chega. Cargo/cidade e legenda de cada post ficam em
  locales/<idioma>.js → associates.items[id] = [cargo, legenda]; sem cargo, vale o do cadastro de
  especialistas (people), que também dá a foto do avatar.
  type:     'video' ou 'photo' (define a aba e o ícone no canto do quadrado)
  name:     nome do associado, como deve aparecer (igual nos três idiomas)
  image:    foto do post ou capa do vídeo (recortada em quadrado na grade; inteira na janela)
  vertical: vídeo em pé (formato Reels): a janela abre em 9:16
  videoSrc: arquivo hospedado no próprio site (ex.: 'videos/associados/nome-sobrenome.mp4'). Sem ele, o player
            mostra a capa e avisa que o vídeo ainda vai ser publicado. Vídeo vertical também funciona:
            aparece inteiro no centro do quadro, com fundo escuro nas laterais.
  photo (opcional): foto do associado, aparece redonda ao lado do nome
*/
// Aparece na Home quando houver itens na lista. Para esconder mesmo assim, troque por false.
export const showAssociates = true;

const associatesBase = [];

// Notícias → listagem de notícias e páginas de área. Sem texto, aparecem como "Em breve". Ao publicar, incluir date
// (aparece só dentro da notícia), readTime (tempo de leitura) e o texto em locales/<idioma>.js → content[id][2]
// (lista de parágrafos) ou, por estudo, em highlights.js.
const textsBase = [];

// Apoiadores (seção no fim da Home e avisos obrigatórios). Sem itens, a seção some e o rodapé sai sem a frase de apoio.
export const supporters = [
  { name: SPONSOR, logo: partnerLogo, logoHeight: 52, pharma: true },
  // pharma: true → empresa patrocinadora; só essas entram nos avisos obrigatórios (topo, rodapé, cards)
  // logoHeight (opcional, px): logos quadradas precisam de mais altura para ter o mesmo peso das horizontais
  // ?v=1: a Cloudflare guarda imagens por 7 dias; ao trocar o arquivo de um logo, suba o número para ela buscar o novo
  // Não incluir a Medscape aqui: pelas diretrizes, o logo dela só aparece no cabeçalho/rodapé, nunca ao lado de farmacêutica
];

/*
  Avisos de apoio exigidos pelas diretrizes Medscape (Saned/Medscape Branding and Content Guidelines):
  - Topo da página: "Desenvolvido pela Medscape a pedido da AstraZeneca" (frase do briefing, aguardando
    confirmação; a versão em português das diretrizes diz "com o apoio da [Pharma]")
  - Rodapé de todas as páginas: aviso de "Cobertura de Conferência"
  - Nunca usar "parceria" para a relação Medscape + empresa farmacêutica
  Os textos de cada idioma (sponsorLine, footerDisclaimer) estão em locales/; os nomes vêm das
  empresas marcadas com "pharma: true" na lista de apoiadores acima.
*/
const sponsorNames = supporters.filter((s) => s.pharma).map((s) => s.name);

// Logo da empresa patrocinadora (vem da lista de apoiadores)
export const sponsorOf = (name) => supporters.find((s) => s.name === name);

/*
  Módulo de conteúdo especial dentro de uma área (handoff, pág. 13).
  A arquitetura fica pronta, mas o módulo só aparece quando um item for adicionado aqui,
  depois da aprovação comercial. Formato: { topic, title, sponsor, href, cta }.
*/
export const specialModules = [];

/* ---------- Página de conteúdo ----------
  Campos opcionais por conteúdo (nas listas acima):
  - speakers: [{ name, role, photo? }] — especialistas do conteúdo
  - videoSrc: arquivo de vídeo hospedado no próprio site (ex.: 'videos/panorama.mp4').
              Não usar players externos (Vimeo, YouTube etc.): eles gravam cookies, e as diretrizes
              Medscape proíbem coletar dados pessoais nas landing pages.
  Campos opcionais por idioma (em locales/<idioma>.js, se precisar): summary e body de cada conteúdo.
*/

// Monta todo o conteúdo do site num idioma. Resultado guardado: cada idioma é montado uma vez só.
const cache = {};

export function buildContent(lang) {
  if (cache[lang]) return cache[lang];
  const L = locales[lang] ?? locales[defaultLang];

  const event = { ...eventBase, ...L.event, ...L.editions?.[EDITION] };
  // Último dia do congresso por extenso ("15 de dezembro"): diz quando sai o Pós-ASH
  event.endLabel = event.end
    ? new Intl.DateTimeFormat(L.htmlLang, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${event.end}T00:00:00Z`))
    : null;

  // Cada dia do congresso já formatado no idioma atual (dia da semana, número, mês)
  const part = (opts) => new Intl.DateTimeFormat(L.htmlLang, { ...opts, timeZone: 'UTC' });
  const weekday = part({ weekday: 'short' });
  const month = part({ month: 'short' });
  event.days = [];
  if (event.start) for (let d = new Date(`${event.start}T00:00:00Z`); d <= new Date(`${event.end}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    event.days.push({
      iso: d.toISOString().slice(0, 10),
      day: d.getUTCDate(),
      weekday: weekday.format(d).replace('.', ''),
      month: month.format(d).replace('.', ''),
    });
  }
  const longDate = part({ day: 'numeric', month: 'long' });
  event.startLabel = event.start && longDate.format(new Date(`${event.start}T00:00:00Z`));
  event.endLabel = event.end && longDate.format(new Date(`${event.end}T00:00:00Z`));
  const topicLabel = (id) => L.topics[id];

  // Data por extenso no idioma atual. UTC fixo: sem isso, o fuso do navegador pode puxar um dia a menos.
  const dateFormat = new Intl.DateTimeFormat(L.htmlLang, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const formatDate = (iso) => dateFormat.format(new Date(`${iso}T00:00:00Z`)).replace('.', '');

  // Campos que todo conteúdo tem, em qualquer listagem: rota, natureza (editorial/patrocinado) e data
  // Data curta para o selo "Em breve · 24 out"
  const shortFormat = new Intl.DateTimeFormat(L.htmlLang, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const shortDate = (iso) =>
    shortFormat.formatToParts(new Date(`${iso}T00:00:00Z`)).filter((p) => p.type === 'day' || p.type === 'month').map((p) => p.value.replace('.', '')).join(' ');

  const prepare = (item, type) => {
    const [title, description, localText] = L.content[item.id] ?? [item.id, ''];
    // Highlights por estudo (highlights.js, em português) ou parágrafos simples por idioma
    const ready = highlights[item.id]?.filter((s) => !s.pending);
    const sections = ready?.length ? ready : undefined;
    const text = sections ? sections.flatMap((s) => s.paragraphs) : localText;
    return {
      ...item,
      type,
      title,
      description,
      href: item.slug ? `#/${item.topic}/${item.slug}` : `#/${item.topic}`,
      sponsored: Boolean(item.sponsor),
      // Data só aparece dentro do conteúdo (revisão de 20/10/2026: nada de data nas chamadas)
      dateLabel: item.date ? formatDate(item.date) : null,
      shortDate: item.date ? shortDate(item.date) : null,
      transcript: transcripts[item.id] ?? null,
      // Texto completo da notícia (lista de parágrafos), quando já publicado
      text,
      sections,
      // Ainda não publicado: vídeo sem arquivo ou notícia sem texto. Aparece com o selo "Em breve".
      upcoming: type === 'video' ? !item.videoSrc : !text,
    };
  };

  // Publicados sempre na frente dos "Em breve" (sem mudar a ordem dentro de cada grupo). Vale para o
  // carrossel da Home, as listagens, o "Continue explorando" e as páginas de área.
  const publishedFirst = (list) => [...list].sort((a, b) => Number(a.upcoming) - Number(b.upcoming));

  const featuredVideos = publishedFirst(featuredBase.map((v) => prepare(v, 'video')));
  const finalVideos = finalBase.map((v) => ({ ...prepare(v, 'video'), final: true, kicker: L.page.synthesisKicker }));
  const post = prepare(postBase, 'video');
  // Dados da pessoa no idioma: { specialty, role, bio, coi } (ou só o cargo, em texto)
  const personInfo = (person) => {
    const info = L.people?.[person?.id];
    return typeof info === 'string' ? { role: info } : info;
  };
  const texts = textsBase.map((t) => prepare(t, 'analise'));
  const associates = associatesBase.map((a) => {
    const [role, description] = L.associates.items[a.id] ?? ['', ''];
    const person = personByName.get(a.name);
    return { ...a, role: role || personInfo(person)?.role || '', description, avatar: person?.photo };
  });
  const allContent = [...featuredVideos, ...finalVideos, ...texts];

  // Catálogo navegável: tudo menos os dois vídeos de encerramento, que vivem na Síntese final
  const catalog = allContent.filter((c) => !c.final);
  const byDate = (a, b) => (b.date ?? '').localeCompare(a.date ?? '');

  // Uma área terapêutica com seus conteúdos já separados por formato
  function getTopic(id) {
    if (!topicIds.includes(id)) return null;
    // ordered: na ordem das listas (= ordem em que sobem); items: mais recentes primeiro
    const ordered = catalog.filter((c) => c.topic === id);
    const items = [...ordered].sort(byDate);
    const videos = items.filter((c) => c.type === 'video');
    const news = items.filter((c) => c.type === 'analise');
    return {
      id,
      label: topicLabel(id),
      cover: topicCovers[id],
      items,
      ordered,
      videos,
      news,
      highlight: pickHighlight(ordered),
      subtopics: (topicSubtopics[id] ?? []).map((key) => ({ id: key, label: L.subtopics?.[key] ?? key })),
      // Apresentação da área e temas em foco (textos provisórios em locales/<idioma>.js → areas)
      intro: L.areas?.[id]?.intro ?? '',
      points: L.areas?.[id]?.points ?? [],
      committee: topicCommittee[id] ?? [],
      // Títulos de notícias da área (até 4), no alto da página, com o link para a listagem de notícias
      headlines: (L.areas?.[id]?.headlines ?? []).slice(0, 4),
      // "Atualizado em": só depois que a data chega (antes do congresso as datas são as previstas de gravação)
      updated: items[0] && items[0].date <= new Date().toLocaleDateString('sv') ? items[0].dateLabel : null,
      // Continue explorando: conteúdos mais recentes de outras áreas
      related: publishedFirst(catalog.filter((c) => c.topic !== id).sort(byDate)).slice(0, 6),
      special: specialModules.find((m) => m.topic === id) ?? null,
    };
  }

  // As áreas aparecem sempre, mesmo antes de ter conteúdo publicado ("Em breve")
  const topics = topicIds.map((id) => getTopic(id));

  // Listagem por formato, opcionalmente filtrada por área
  function listing(format, topic) {
    const type = format === 'videos' ? 'video' : 'analise';
    return publishedFirst(catalog.filter((c) => c.type === type && (!topic || c.topic === topic)).sort(byDate));
  }

  // Dados da página de um conteúdo (vídeo da Home ou o do Pós-ASH)
  function contentPage(item) {
    if (!item) return null;
    const isVideo = item.type !== 'analise';
    return {
      ...item,
      isVideo,
      kicker: item.kicker ?? (isVideo ? L.page.videoKicker : L.page.textKicker),
      sponsorInfo: item.sponsor ? sponsorOf(item.sponsor) : null,
      topicLabel: topicLabel(item.topic),
      // Abertura da página: o texto de apoio aprovado, sem acrescentar frases (as chamadas são revisadas)
      summary: item.summary ?? item.description,
      body: item.text ?? item.body ?? L.page.body(event.name),
      // Sem especialistas informados, o bloco não aparece (nada de nome provisório no site)
      // Foto e cargo vêm do cadastro de especialistas, pelo nome
      speakers: (item.speakers ?? []).map((s) => {
        const p = personByName.get(s.name);
        return p ? { photo: p.photo, ...personInfo(p), ...s } : s;
      }),
    };
  }

  const getContent = (topic, slug) => contentPage(allContent.find((c) => c.topic === topic && c.slug === slug));

  // Outros conteúdos para continuar a navegação: primeiro os da mesma área, depois os demais.
  // Mistura vídeos e notícias, com e sem apoio, sem agrupar por empresa.
  function relatedContent(item, count = 3) {
    const others = catalog.filter((c) => c.id !== item.id);
    const sameTopic = others.filter((c) => c.topic === item.topic);
    const rest = others.filter((c) => !sameTopic.includes(c));
    return [...publishedFirst(sameTopic), ...publishedFirst(rest)].slice(0, count);
  }

  // Busca restrita à cobertura: título, descrição e área.
  // Ignora acentos dos dois lados, para "pulmao" encontrar "Pulmão".
  const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ\u00AD]/g, '').toLowerCase(); // sem acentos nem hífens opcionais
  function search(term) {
    const q = fold(term.trim());
    if (!q) return [];
    const has = (c) => fold(`${c.title} ${c.description} ${topicLabel(c.topic) ?? ''}`).includes(q);
    return allContent.filter(has).sort(byDate);
  }

  cache[lang] = {
    lang: L.code,
    htmlLang: L.htmlLang,
    event,
    // Menu global: Home | Destaques da cobertura | Pós-ASH (com o aviso enquanto o vídeo não sai)
    navLinks: [
      { key: 'home', label: L.nav.home, href: '#/' },
      { key: 'destaques', label: L.nav.destaques, href: '#destaques' },
      { key: 'pos', label: L.nav.pos, note: post.upcoming ? L.nav.posNote : null, href: `#/${POST}` },
    ],
    featuredVideos,
    // Algum vídeo já tem arquivo? Enquanto nenhum tiver, a Home mostra a faixa "Em breve" antes do carrossel
    videosReleased: featuredVideos.some((v) => !v.upcoming),
    finalVideos,
    finalSynthesis: L.finalSynthesis,
    associates,
    associatesText: L.associates,
    texts,
    topics,
    topicLabel,
    catalog,
    allContent,
    getTopic,
    listing,
    getContent,
    postContent: contentPage(post),
    relatedContent,
    search,
    // Frase de um conteúdo patrocinado: "Desenvolvido pela Medscape a pedido da [Pharma]"
    sponsorLine: (names) => L.sponsorLine(names),
    disclosure: {
      // Topo da página: frase + nome da empresa (em outra linha no celular)
      top: `${L.topDisclosure} ${L.partner}`,
      topParts: [L.topDisclosure, L.partner],
      footer: L.footerDisclaimer(sponsorNames),
    },
    partner: { name: L.partner, logo: partnerLogo },
    footer: L.footer,
    nav: L.nav,
    ui: L.ui,
    page: L.page,
  };
  return cache[lang];
}
