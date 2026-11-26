// Textos en español. Misma estructura que pt.js.
import { EVENT_NAME } from '../edition.js';

const join = (names) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} y ${names.at(-1)}`;

// Nome da área no meio da frase: inicial minúscula ("de tumores mamários", não "de Tumores mamários")
const lowerFirst = (s) => s.charAt(0).toLocaleLowerCase() + s.slice(1);

export default {
  code: 'es',
  htmlLang: 'es',
  short: 'ES',
  name: 'Español',

  // Datas e cidade de cada edição (edição no ar: ../edition.js). Edição sem entrada aqui: o banner sai sem data e cidade.
  editions: {
    2026: { dates: '12 al 15 de diciembre de 2026', city: 'Nueva Orleans, Luisiana' },
  },

  // Textos do banner: provisórios, aguardando aprovação
  event: {
    tagline: 'Hematología • Análisis de especialistas', // linha de rodapé do banner, ao lado da cidade (provisório)
    title: ['Los avances de la hematología', 'en la lectura de especialistas'],
    lead: 'Videos con análisis de los principales estudios y avances presentados en el congreso, con foco en lo que puede cambiar la práctica clínica.',
    heroAlt: '',
  },

  // Empresa que solicita a cobertura (logo em content.js → partnerLogo)
  partner: 'AstraZeneca',

  nav: { home: 'Inicio', destaques: 'Destacados de la cobertura', pos: 'Pos-ASH', posNote: 'Contenido disponible después del congreso' },

  topics: {
    'area-1': 'Área 1',
    'area-2': 'Área 2',
    'area-3': 'Área 3',
    'area-4': 'Área 4',
    'area-5': 'Área 5',
    outros: 'Otros temas',
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
    'video-1': ['Título del video 1', 'Texto de apoyo por confirmar.'],
    'video-2': ['Título del video 2', 'Texto de apoyo por confirmar.'],
    'video-3': ['Título del video 3', 'Texto de apoyo por confirmar.'],
    'video-4': ['Título del video 4', 'Texto de apoyo por confirmar.'],
    'pos-ash': ['Título del video', ''],
  },

  finalSynthesis: {
    eyebrow: 'Síntesis final',
    title: ['Lo más destacado,', 'en dos conversaciones.'],
    description: 'Al final del congreso, una visión integrada de los temas de mayor impacto y de lo que cambia en la práctica.',
  },

  // Seção da Home com os depoimentos em vídeo dos associados (nome da seção aguardando aprovação)
  associates: {
    title: 'ASH a través de los asociados',
    sub: 'Asociados cuentan lo que vieron en el congreso y lo que llevan a la práctica.',
    watch: (name) => `Ver el testimonio de ${name}`,
    close: 'Cerrar',
    more: 'Ver más publicaciones',
    filters: 'Tipo de contenido',
    all: 'Todos',
    photos: 'Fotos',
    videos: 'Videos',
    see: (name) => `Ver la publicación de ${name}`,
    empty: 'Aún no hay publicaciones de este tipo.',
    place: EVENT_NAME,
    // [cargo e cidade (vazio = o do cadastro de especialistas), legenda]
    items: {},
  },

  // Avisos obligatorios (directrices Medscape, versión en español del PDF)
  // Aviso do topo da página: começo da frase; o nome da instituição (partner) entra em seguida, em outra linha no celular
  topDisclosure: 'Desarrollado por Medscape a petición de',
  sponsorLine: (names) => `Desarrollado por Medscape a petición de ${join(names)}`,
  // Tradução do texto do briefing em português: aguardando aprovação
  footerDisclaimer: (names) =>
    `La cobertura de la conferencia fue desarrollada por Medscape a petición de ${join(names)}. ` +
    `${join(names)} ${names.length === 1 ? 'llevó' : 'llevaron'} a cabo un proceso completo de aprobación médica para garantizar el cumplimiento de las regulaciones aplicables. ` +
    'Ninguna parte de esta cobertura puede reproducirse, total o parcialmente, sin el permiso del editor. ' +
    'Las opiniones y los puntos de vista expresados no representan necesariamente la visión de Medscape, de sus editores, asesores o anunciantes.',

  // Rodapé mínimo: marcas, público, privacidade e o aviso obrigatório (acima)
  footer: {
    developedBy: 'Desarrollado por',
    requestedBy: 'A petición de',
    audience: 'Contenido destinado exclusivamente a profesionales de la salud.',
    privacy: { label: 'Política de privacidad', href: 'https://www.medscape.com/public/privacy' },
    newTab: '(se abre en una nueva pestaña)',
  },

  ui: {
    skip: 'Ir al contenido',
    homePartner: (name) => `${name}, volver al inicio`,
    homeMedscape: 'Medscape, volver al inicio',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mainNav: 'Principal',
    language: 'Idioma',

    exploreCoverage: `Seguir el ${EVENT_NAME}`,
    videosCount: (n) => `${n} videos de cobertura`,
    atYourPace: 'Explore a su ritmo.',
    seeAll: 'Ver todos',

    textsTitle: 'Noticias de la cobertura',
    textsSub: 'Los estudios y debates del congreso, con la lectura de los especialistas.',

    areasTitle: 'Explore por área terapéutica',
    areasSub: 'Elija el tema de su práctica y vea lo que la cobertura trae sobre él.',
    areaVideos: (n) => `${n} ${n === 1 ? 'video' : 'videos'}`,
    areaNews: (n) => `${n} ${n === 1 ? 'noticia' : 'noticias'}`,
    // Contagem completa para leitores de tela: "2 vídeos · 1 notícia"
    areaCount(videos, news) {
      return [videos && this.areaVideos(videos), news && this.areaNews(news)].filter(Boolean).join(' · ');
    },
    areaCta: (topic) => `Ver contenidos de ${lowerFirst(topic)}`,
    coverageOf: (name) => `Cobertura ${name}`,
    readTime: (t) => `${t} de lectura`,
    exploreByTopic: 'Explorar por tema',

    featuredTitle: 'Destacados de la cobertura',
    featuredSub: `Análisis en video, directamente desde ${EVENT_NAME}`,
    featuredLead: 'Análisis en video con especialistas, publicados durante el congreso.',
    watchNow: 'Ver',
    featuredLabel: 'Destacados',
    goToVideo: 'Ir al video',
    previous: 'anterior',
    next: 'siguiente',

    part: (n) => `Parte ${n}`,
    duration: 'Duración',

    exploreTitle: 'Explore por tema',
    exploreSub: 'Contenidos seleccionados, incluidos videos y análisis, para profundizar en los temas de mayor interés.',
    all: 'Todos',
    moreTopics: 'Más temas',
    filterByTopic: 'Filtrar por tema',
    topicsLabel: 'Temas',
    emptyTopic: 'Todavía no hay contenidos publicados para este tema.',
    goToContent: 'Ir al contenido',

    supportersTitle: 'Patrocinadores',

    // Naturaleza del contenido (handoff): cada card muestra una de las dos antes del clic
    editorial: 'Editorial',
    sponsoredBadge: 'Contenido patrocinado',
    coverage: 'Cobertura',

    // Área terapéutica
    topicKicker: 'Área terapéutica',
    topicSub: 'Noticias, videos y análisis seleccionados',
    topicCommittee: 'Comité científico',
    topicHeadlines: 'Noticias de la cobertura',
    topicHeadlinesCta: (topic) => `Ver noticias de ${lowerFirst(topic)}`,
    topicAreas: 'Otras áreas terapéuticas',
    topicSubtopics: 'Especialidades',
    topicAllSubtopics: 'Todos',
    topicFocus: 'En foco en esta área',
    topicUpdated: (d) => `Actualizado el ${d}`,
    topicRelatedSub: 'Videos y noticias de otras áreas de la cobertura.',
    topicHighlight: 'Destacado',
    newsHeading: 'Noticias',
    videosHeading: 'Videos',
    topicEmpty: 'Todavía no hay contenidos publicados en esta área.',
    backToTopic: (t) => `Volver a ${t}`,
    seeAllNews: 'Ver todas las noticias',
    seeAllVideos: 'Ver todos los videos',

    // Listados por formato
    newsListTitle: 'Noticias',
    newsListSub: 'Actualizaciones editoriales y patrocinadas de la cobertura',
    videoListTitle: 'Videos',
    videoListSub: 'Highlights, entrevistas y comentarios',
    filterByArea: 'Filtrar por área terapéutica',
    resultsCount: (n) => `${n} ${n === 1 ? 'contenido' : 'contenidos'}`,
    listingEmpty: 'Ningún contenido en esta área por ahora.',

    // Síntesis final
    synthesisTitle: (name) => `Síntesis final ${name}`,
    synthesisSub: 'Principales mensajes por área terapéutica',
    synthesisAreasSub: 'Qué esperar de cada área en el congreso, en pocas líneas, con el camino a los videos y las noticias.',
    explore: 'Explorar',

    // Búsqueda
    searchTitle: 'Búsqueda en la cobertura',
    searchPlaceholder: 'Tema, estudio o especialista',
    searchButton: 'Buscar',
    searchResults: (n) => `${n} ${n === 1 ? 'resultado' : 'resultados'}`,
    searchEmpty: (q) => `No se encontró nada para “${q}”. Pruebe otro término o explore por área terapéutica.`,
    searchPrompt: 'Busque por tema, estudio o especialista en los videos y noticias de la cobertura.',

    // Antes de la publicación de los contenidos
    soon: 'Próximamente',
    soonText: 'Los videos y las noticias de la cobertura se publicarán durante el congreso.',
    soonTopic: (topic) => `Los videos y las noticias de ${lowerFirst(topic)} se publicarán durante el congreso.`,
    soonVideos: 'Los videos de la cobertura se publicarán durante el congreso.',
    soonNews: 'Las noticias de la cobertura se publicarán durante el congreso.',
    soonSynthesis: 'Las dos conversaciones de cierre se publicarán al final del congreso.',
    soonSearch: 'Los contenidos de la cobertura aún no se han publicado. Vuelva durante el congreso para buscar.',
    soonStarts: (date) => `La cobertura comienza el ${date}`,
    soonEnds: (date) => `Al cierre del congreso, el ${date}`,
    soonLive: 'Cobertura en curso',
    soonDay: (day, total) => `Día ${day} de ${total}`,
    soonCountdown: (n) => (n === 1 ? 'Falta 1 día' : `Faltan ${n} días`),
    soonWhat: 'Lo que viene',
    soonItems: [
      { key: 'videos', title: 'Videos', text: 'Lo más destacado de cada área, comentado por especialistas.' },
      { key: 'noticias', title: 'Noticias', text: 'Los estudios y debates del congreso, con la lectura de los especialistas.' },
    ],
    soonExpected: (date) => `Previsto para el ${date}`,
    soonCalendar: 'Días del congreso',
    soonToday: 'Hoy',
    soonFirst: 'Inicio',
    soonLast: 'Clausura',

    video: 'Video',
    text: 'Noticia',
  },

  page: {
    back: 'Volver a la cobertura',

    // Página de vídeo: compartilhamento, abas, transcrição e "Sobre o vídeo" (traduções aguardando aprovação)
    share: 'Compartir',
    shareEmail: 'Correo',
    shareWhatsapp: 'WhatsApp',
    shareEmailLabel: 'Compartir por correo electrónico',
    shareWhatsappLabel: 'Compartir por WhatsApp',
    shareText: (title, name) => `${title} | Cobertura ${name}, Medscape`,
    tabs: 'Contenido del video',
    transcript: 'Transcripción del video',
    transcriptSoon: 'La transcripción completa se publicará junto con el video (en portugués).',
    downloadPdf: 'Descargar en PDF',
    downloadBusy: 'Generando PDF…',
    downloadError: 'No se pudo generar el PDF. Inténtelo de nuevo.',
    downloadSoon: 'PDF disponible cuando se publique la transcripción.',
    about: 'Sobre el video',
    aboutIntro: (name, sponsor) => [
      `Este video forma parte de la cobertura especial del ${name}, desarrollada por Medscape a petición de ${sponsor}.`,
      'El contenido reúne análisis y perspectivas de especialistas sobre los principales estudios, avances científicos y actualizaciones presentados durante el congreso, con foco en sus posibles implicaciones para la práctica clínica.',
    ],
    coiTitle: 'Declaración de conflictos de interés y responsabilidad editorial',
    coiText: (sponsor) => [
      'Los especialistas participantes declaran sus potenciales conflictos de interés, de conformidad con las políticas de transparencia aplicables a la actividad.',
      `Las opiniones, análisis y recomendaciones médicas presentadas en este video son responsabilidad exclusiva de los respectivos especialistas y no reflejan necesariamente la posición de Medscape, de sus editores, asesores o de ${sponsor}.`,
      'El contenido tiene carácter exclusivamente científico y educativo y no sustituye la evaluación clínica individualizada ni el juicio profesional del médico tratante.',
    ],
    speakersTitle: 'Especialistas participantes',
    bio: 'Minicurrículum',
    coi: 'Conflictos de interés',
    postTitle: (name) => `Pos-${name}`,
    postSoon: 'Contenido disponible después del congreso.',
    postSoonNote: (name, end) => `El análisis poscongreso se publicará aquí después del cierre del ${name}${end ? `, el ${end}` : ''}.`,
    videoKicker: 'Video de la cobertura',
    textKicker: 'Noticia de la cobertura',
    synthesisKicker: 'Síntesis final',
    watch: (title) => `Ver: ${title}`,
    newsSoonTitle: 'La noticia completa se publicará durante el congreso',
    newsSoon: 'Los especialistas publican el análisis a lo largo del congreso, con lo que cambia en la práctica clínica.',
    newsSoonCta: (topic) => `Ver todo sobre ${lowerFirst(topic)}`,
    hlCount: (n) => `${n} ${n === 1 ? 'estudio destacado' : 'estudios destacados'}`,
    hlMinutes: (n) => `${n} min de lectura`,
    hlPosition: (i, n) => `Estudio ${i} de ${n}`,
    hlPrev: 'Estudio anterior',
    hlNext: 'Siguiente estudio',
    hlClose: 'Cerrar',
    videoSoon: 'El video se publicará aquí en cuanto se apruebe la grabación final.',
    supportedBy: 'Contenido patrocinado',
    // Página de contenido patrocinado: aviso arriba, sobre el título (handoff, pág. 10)
    sponsoredBy: 'Contenido patrocinado por',
    sponsoredNote: 'Material desarrollado para profesionales de la salud',
    byline: (name, date) => `Cobertura ${name} • ${date}`,

    expert: 'Especialista',
    experts: 'Especialistas',
    aboutVideo: 'Sobre este video',
    aboutText: 'Sobre esta noticia',
    place: 'Lugar',
    dates: 'Fechas',
    formatValue: 'Video con transcripción',
    format: 'Formato',
    topic: 'Tema',
    event: 'Evento',
    related: 'Siga explorando',
    relatedSub: (name) => `Otros videos y análisis de la cobertura del ${name}.`,
    notFound: 'Contenido no encontrado',
    notFoundText: 'Es posible que el enlace esté incompleto o que el contenido aún no se haya publicado.',
    notFoundBack: 'Volver a la cobertura',
    notFoundSearch: 'Buscar en la cobertura',
    notFoundAreas: 'O elija un área terapéutica',
    // Modelo mostrado enquanto o vídeo está "Em breve" e os especialistas não foram informados; some ao publicar o vídeo
    placeholderSpeaker: {
      placeholder: true,
      name: 'Dr(a). [Nombre completo del especialista]',
      specialty: '[Especialidad médica]',
      role: '[Cargo e institución]',
      bio: '[Breve presentación de la trayectoria profesional, formación académica, actuación institucional y experiencia en el área relacionada con el video.]',
      coi: '[Conflictos declarados por el especialista o ausencia de conflictos, según declaración individual.]',
    },
    body: (eventName) => [
      `Esta noticia recorre las principales presentaciones del ${eventName} sobre el tema y organiza los puntos que más llamaron la atención de los especialistas durante el congreso.`,
      'El texto destaca el diseño de los estudios, los resultados presentados y las preguntas que siguen abiertas, con foco en lo que puede incorporarse a la práctica clínica.',
      'Texto completo de la noticia a incluir cuando se apruebe el contenido final.',
    ],
  },
};
