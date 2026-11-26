// Textos em português (idioma padrão). Os outros idiomas seguem exatamente a mesma estrutura.
// Títulos e descrições dos conteúdos são provisórios até a lista final.
import { EVENT_NAME } from '../edition.js';

const join = (names) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} e ${names.at(-1)}`;

// "da Empresa X" (uma empresa) ou "das empresas X, Y e Z" (várias)
const supportedBy = (names) => (names.length === 1 ? `da ${names[0]}` : `das empresas ${join(names)}`);

// Nome da área no meio da frase: inicial minúscula ("de tumores mamários", não "de Tumores mamários")
const lowerFirst = (s) => s.charAt(0).toLocaleLowerCase() + s.slice(1);

export default {
  code: 'pt',
  htmlLang: 'pt-BR',
  short: 'PT',
  name: 'Português',

  // Datas e cidade de cada edição (edição no ar: ../edition.js). Edição sem entrada aqui: o banner sai sem data e cidade.
  editions: {
    2026: { dates: '12 a 15 de dezembro de 2026', city: 'New Orleans, Louisiana' },
  },

  // Textos do banner: provisórios, aguardando aprovação
  event: {
    tagline: 'Hematologia • Análise de especialistas', // linha de rodapé do banner, ao lado da cidade (provisório)
    title: ['Os avanços da hematologia', 'na leitura de especialistas'],
    lead: 'Vídeos com análises dos principais estudos e avanços apresentados no congresso, com foco no que pode mudar a prática clínica.',
    heroAlt: '',
  },

  // Empresa que solicita a cobertura (logo em content.js → partnerLogo)
  partner: 'AstraZeneca',

  nav: { home: 'Home', destaques: 'Destaques da cobertura', pos: 'Pós-ASH', posNote: 'Conteúdo disponível após o congresso' },

  topics: {
    'area-1': 'Área 1',
    'area-2': 'Área 2',
    'area-3': 'Área 3',
    'area-4': 'Área 4',
    'area-5': 'Área 5',
    outros: 'Outros temas',
  },

  // Especialidades reunidas em "Outros temas": botões que filtram os conteúdos da página
  subtopics: {
    'tema-1': 'Tema 1',
    'tema-2': 'Tema 2',
    'tema-3': 'Tema 3',
  },

  // Apresentação de cada área (página da área), pelo id da área:
  // { 'area-1': { intro: 'Texto de abertura.', points: ['Tema em foco'], headlines: ['Título de notícia (até 4)'] } }
  areas: {},

  // Especialistas dos vídeos, pelo id do cadastro em content.js → people:
  // { 'nome-sobrenome': { specialty: 'Hematologia', role: 'Cargo e instituição', bio: 'Minicurrículo.', coi: 'Conflitos declarados.' } }
  people: {},

  // Título e texto de apoio de cada vídeo: { id: ['Título', 'Texto de apoio.'] }. Provisórios até a lista final.
  content: {
    'video-1': ['Título do vídeo 1', 'Texto de apoio do vídeo a confirmar.'],
    'video-2': ['Título do vídeo 2', 'Texto de apoio do vídeo a confirmar.'],
    'video-3': ['Título do vídeo 3', 'Texto de apoio do vídeo a confirmar.'],
    'video-4': ['Título do vídeo 4', 'Texto de apoio do vídeo a confirmar.'],
    'pos-ash': ['Título do vídeo', ''],
  },

  finalSynthesis: {
    eyebrow: 'Síntese final',
    title: ['Os principais destaques,', 'em duas conversas.'],
    description: 'Ao fim do congresso, uma visão integrada dos temas de maior impacto e do que muda na prática.',
  },

  // Seção da Home com os depoimentos em vídeo dos associados (nome da seção aguardando aprovação)
  associates: {
    title: 'ASH pelo olhar dos associados',
    sub: 'Associados contam o que viram no congresso e o que levam para a prática.',
    watch: (name) => `Assistir ao depoimento de ${name}`,
    close: 'Fechar',
    more: 'Ver mais publicações',
    filters: 'Tipo de conteúdo',
    all: 'Todos',
    photos: 'Fotos',
    videos: 'Vídeos',
    see: (name) => `Ver a publicação de ${name}`,
    empty: 'Nenhuma publicação deste tipo por enquanto.',
    place: EVENT_NAME,
    // [cargo e cidade (vazio = o do cadastro de especialistas), legenda]
    items: {},
  },

  /* Avisos obrigatórios (diretrizes Medscape, versão em português do PDF).
     Nunca usar "parceria" para a relação Medscape + empresa farmacêutica. */
  // Aviso do topo da página: começo da frase; o nome da instituição (partner) entra em seguida, em outra linha no celular
  // "pela Medscape" (feminino), como nas diretrizes Medscape em português e no aviso do rodapé
  topDisclosure: 'Desenvolvido pela Medscape a pedido da',
  sponsorLine: (names) => `Desenvolvido pela Medscape a pedido ${supportedBy(names)}`,
  // Texto do briefing (rodapé de todas as páginas)
  footerDisclaimer: (names) =>
    `A cobertura da conferência foi desenvolvida pela Medscape a pedido ${supportedBy(names)}. ` +
    (names.length === 1 ? `A ${names[0]} realizou` : `As empresas ${join(names)} realizaram`) +
    ' um processo completo de aprovação médica para garantir a conformidade com as regulamentações aplicáveis. ' +
    'Nenhuma parte desta cobertura pode ser reproduzida, total ou parcialmente, sem a permissão do editor. ' +
    'As opiniões e os pontos de vista expressos não representam necessariamente a visão da Medscape, de seus editores, consultores ou anunciantes.',

  // Rodapé mínimo: marcas, público, privacidade e o aviso obrigatório (acima)
  footer: {
    developedBy: 'Desenvolvido por',
    requestedBy: 'A pedido da',
    audience: 'Conteúdo destinado exclusivamente a profissionais de saúde.',
    privacy: { label: 'Política de privacidade', href: 'https://www.medscape.com/public/privacy' },
    newTab: '(abre em nova aba)',
  },

  ui: {
    skip: 'Ir para o conteúdo',
    homePartner: (name) => `${name}, voltar ao início`,
    homeMedscape: 'Medscape, voltar ao início',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    mainNav: 'Principal',
    language: 'Idioma',

    exploreCoverage: `Acompanhar o ${EVENT_NAME}`,
    videosCount: (n) => `${n} vídeos de cobertura`,
    atYourPace: 'Explore no seu ritmo.',
    seeAll: 'Ver todos',

    textsTitle: 'Notícias da cobertura',
    textsSub: 'Os estudos e debates do congresso, com a leitura dos especialistas.',

    areasTitle: 'Explore por área terapêutica',
    areasSub: 'Escolha o tema da sua prática e veja o que a cobertura traz sobre ele.',
    areaVideos: (n) => `${n} ${n === 1 ? 'vídeo' : 'vídeos'}`,
    areaNews: (n) => `${n} ${n === 1 ? 'notícia' : 'notícias'}`,
    // Contagem completa para leitores de tela: "2 vídeos · 1 notícia"
    areaCount(videos, news) {
      return [videos && this.areaVideos(videos), news && this.areaNews(news)].filter(Boolean).join(' · ');
    },
    areaCta: (topic) => `Ver conteúdos de ${lowerFirst(topic)}`,
    coverageOf: (name) => `Cobertura ${name}`,
    readTime: (t) => `${t} de leitura`,
    exploreByTopic: 'Explorar por tema',

    featuredTitle: 'Destaques da cobertura',
    featuredSub: `Análises em vídeo, diretamente do ${EVENT_NAME}`,
    featuredLead: 'Análises em vídeo com especialistas, publicadas durante o congresso.',
    watchNow: 'Assistir',
    featuredLabel: 'Destaques',
    goToVideo: 'Ir para o vídeo',
    previous: 'anterior',
    next: 'próximo',

    part: (n) => `Parte ${n}`,
    duration: 'Duração',

    exploreTitle: 'Explore por tema',
    exploreSub: 'Conteúdos selecionados, incluindo vídeos e análises, para você se aprofundar nos temas de maior interesse.',
    all: 'Todos',
    moreTopics: 'Mais temas',
    filterByTopic: 'Filtrar por tema',
    topicsLabel: 'Temas',
    emptyTopic: 'Ainda não há conteúdos publicados para este tema.',
    goToContent: 'Ir para o conteúdo',

    supportersTitle: 'Apoiadores',

    // Natureza do conteúdo (handoff): todo card mostra uma das duas antes do clique
    editorial: 'Editorial',
    sponsoredBadge: 'Conteúdo patrocinado',
    coverage: 'Cobertura',

    // Área terapêutica
    topicKicker: 'Área terapêutica',
    topicSub: 'Notícias, vídeos e análises selecionadas',
    topicCommittee: 'Comitê científico',
    topicHeadlines: 'Notícias da cobertura',
    topicHeadlinesCta: (topic) => `Ver notícias de ${lowerFirst(topic)}`,
    topicAreas: 'Outras áreas terapêuticas',
    topicSubtopics: 'Especialidades',
    topicAllSubtopics: 'Todos',
    topicFocus: 'Em foco nesta área',
    topicUpdated: (d) => `Atualizado em ${d}`,
    topicRelatedSub: 'Vídeos e notícias de outras áreas da cobertura.',
    topicHighlight: 'Destaque',
    newsHeading: 'Notícias',
    videosHeading: 'Vídeos',
    topicEmpty: 'Ainda não há conteúdos publicados nesta área.',
    backToTopic: (t) => `Voltar para ${t}`,
    seeAllNews: 'Ver todas as notícias',
    seeAllVideos: 'Ver todos os vídeos',

    // Listagens por formato
    newsListTitle: 'Notícias',
    newsListSub: 'Atualizações editoriais e patrocinadas da cobertura',
    videoListTitle: 'Vídeos',
    videoListSub: 'Highlights, entrevistas e comentários',
    filterByArea: 'Filtrar por área terapêutica',
    resultsCount: (n) => `${n} ${n === 1 ? 'conteúdo' : 'conteúdos'}`,
    listingEmpty: 'Nenhum conteúdo nesta área por enquanto.',

    // Síntese final
    synthesisTitle: (name) => `Síntese final ${name}`,
    synthesisSub: 'Principais mensagens por área terapêutica',
    synthesisAreasSub: 'O que esperar de cada área no congresso, em poucas linhas, com o caminho para os vídeos e as notícias.',
    explore: 'Explorar',

    // Busca
    searchTitle: 'Busca na cobertura',
    searchPlaceholder: 'Tema, estudo ou especialista',
    searchButton: 'Buscar',
    searchResults: (n) => `${n} ${n === 1 ? 'resultado' : 'resultados'}`,
    searchEmpty: (q) => `Nada encontrado para “${q}”. Tente outro termo ou explore por área terapêutica.`,
    searchPrompt: 'Busque por tema, estudo ou especialista nos vídeos e notícias da cobertura.',

    // Antes da publicação dos conteúdos
    soon: 'Em breve',
    soonText: 'Os vídeos e as notícias da cobertura serão publicados durante o congresso.',
    soonTopic: (topic) => `Os vídeos e as notícias de ${lowerFirst(topic)} serão publicados durante o congresso.`,
    soonVideos: 'Os vídeos da cobertura serão publicados durante o congresso.',
    soonNews: 'As notícias da cobertura serão publicadas durante o congresso.',
    soonSynthesis: 'As duas conversas de encerramento serão publicadas ao fim do congresso.',
    soonSearch: 'Os conteúdos da cobertura ainda não foram publicados. Volte durante o congresso para buscar.',
    soonStarts: (date) => `A cobertura começa em ${date}`,
    soonEnds: (date) => `No encerramento do congresso, em ${date}`,
    soonLive: 'Cobertura em andamento',
    soonDay: (day, total) => `Dia ${day} de ${total}`,
    soonCountdown: (n) => (n === 1 ? 'Falta 1 dia' : `Faltam ${n} dias`),
    soonWhat: 'O que vem por aí',
    soonItems: [
      { key: 'videos', title: 'Vídeos', text: 'Os destaques de cada área, comentados por especialistas.' },
      { key: 'noticias', title: 'Notícias', text: 'Os estudos e debates do congresso, com a leitura dos especialistas.' },
    ],
    soonExpected: (date) => `Previsto para ${date}`,
    soonCalendar: 'Dias do congresso',
    soonToday: 'Hoje',
    soonFirst: 'Início',
    soonLast: 'Encerramento',

    video: 'Vídeo',
    text: 'Notícia',
  },

  page: {
    back: 'Voltar para a cobertura',

    // Página de vídeo: compartilhamento, abas, transcrição e "Sobre o vídeo"
    share: 'Compartilhar',
    shareEmail: 'E-mail',
    shareWhatsapp: 'WhatsApp',
    shareEmailLabel: 'Compartilhar por e-mail',
    shareWhatsappLabel: 'Compartilhar pelo WhatsApp',
    shareText: (title, name) => `${title} | Cobertura ${name}, Medscape`,
    tabs: 'Conteúdo do vídeo',
    transcript: 'Transcrição do vídeo',
    transcriptSoon: 'A transcrição completa será publicada junto com o vídeo.',
    downloadPdf: 'Baixar em PDF',
    downloadBusy: 'Gerando PDF…',
    downloadError: 'Não foi possível gerar o PDF. Tente novamente.',
    downloadSoon: 'PDF disponível quando a transcrição for publicada.',
    about: 'Sobre o vídeo',
    aboutIntro: (name, sponsor) => [
      `Este vídeo integra a cobertura especial do ${name}, desenvolvida pela Medscape a pedido da ${sponsor}.`,
      'O conteúdo reúne análises e perspectivas de especialistas sobre os principais estudos, avanços científicos e atualizações apresentados durante o congresso, com foco em suas possíveis implicações para a prática clínica.',
    ],
    coiTitle: 'Declaração de conflitos de interesse e responsabilidade editorial',
    coiText: (sponsor) => [
      'Os especialistas participantes declaram seus potenciais conflitos de interesse, em conformidade com as políticas de transparência aplicáveis à atividade.',
      `As opiniões, análises e recomendações médicas apresentadas neste vídeo são de responsabilidade exclusiva dos respectivos especialistas e não refletem necessariamente o posicionamento da Medscape, de seus editores, consultores ou da ${sponsor}.`,
      'O conteúdo possui caráter exclusivamente científico e educacional e não substitui a avaliação clínica individualizada ou o julgamento profissional do médico assistente.',
    ],
    speakersTitle: 'Especialistas participantes',
    bio: 'Minicurrículo',
    coi: 'Conflitos de interesse',
    postTitle: (name) => `Pós-${name}`,
    postSoon: 'Conteúdo disponível após o congresso.',
    postSoonNote: (name, end) => `A análise pós-congresso será publicada aqui depois do encerramento do ${name}${end ? `, em ${end}` : ''}.`,
    videoKicker: 'Vídeo da cobertura',
    textKicker: 'Notícia da cobertura',
    synthesisKicker: 'Síntese final',
    watch: (title) => `Assistir: ${title}`,
    newsSoonTitle: 'A notícia completa será publicada durante o congresso',
    newsSoon: 'Os especialistas publicam a análise ao longo do congresso, com o que muda na prática clínica.',
    newsSoonCta: (topic) => `Ver tudo sobre ${lowerFirst(topic)}`,
    hlCount: (n) => `${n} ${n === 1 ? 'estudo' : 'estudos'} em destaque`,
    hlMinutes: (n) => `${n} min de leitura`,
    hlPosition: (i, n) => `Estudo ${i} de ${n}`,
    hlPrev: 'Estudo anterior',
    hlNext: 'Próximo estudo',
    hlClose: 'Fechar',
    videoSoon: 'O vídeo será publicado aqui assim que a gravação final for aprovada.',
    supportedBy: 'Conteúdo patrocinado',
    // Página de conteúdo patrocinado: aviso no topo, acima do título (handoff, pág. 10)
    sponsoredBy: 'Conteúdo patrocinado por',
    sponsoredNote: 'Material desenvolvido para profissionais de saúde',
    byline: (name, date) => `Cobertura ${name} • ${date}`,

    expert: 'Especialista',
    experts: 'Especialistas',
    aboutVideo: 'Sobre este vídeo',
    aboutText: 'Sobre esta notícia',
    place: 'Local',
    dates: 'Datas',
    formatValue: 'Vídeo com transcrição',
    format: 'Formato',
    topic: 'Tema',
    event: 'Evento',
    related: 'Continue explorando',
    relatedSub: (name) => `Outros vídeos e análises da cobertura do ${name}.`,
    notFound: 'Conteúdo não encontrado',
    notFoundText: 'O link pode estar incompleto ou o conteúdo ainda não foi publicado.',
    notFoundBack: 'Voltar para a cobertura',
    notFoundSearch: 'Buscar na cobertura',
    notFoundAreas: 'Ou escolha uma área terapêutica',
    // Modelo mostrado enquanto o vídeo está "Em breve" e os especialistas não foram informados; some ao publicar o vídeo
    placeholderSpeaker: {
      placeholder: true,
      name: 'Dr(a). [Nome completo do especialista]',
      specialty: '[Especialidade médica]',
      role: '[Cargo e instituição]',
      bio: '[Breve apresentação da trajetória profissional, formação acadêmica, atuação institucional e experiência na área relacionada ao conteúdo do vídeo.]',
      coi: '[Conflitos declarados pelo especialista ou ausência de conflitos, conforme declaração individual.]',
    },
    body: (eventName) => [
      `Esta notícia acompanha as principais apresentações do ${eventName} sobre o tema e organiza os pontos que mais chamaram a atenção dos especialistas durante o congresso.`,
      'O texto destaca o desenho dos estudos, os resultados apresentados e as questões que ainda permanecem em aberto, com foco no que pode ser incorporado à prática clínica.',
      'Texto completo da notícia a ser inserido quando o conteúdo final for aprovado.',
    ],
  },
};
