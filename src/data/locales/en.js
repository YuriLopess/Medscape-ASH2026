// English texts. Same structure as pt.js.
import { EVENT_NAME } from '../edition.js';

const join = (names) =>
  names.length <= 1
    ? names.join('')
    : names.length === 2
      ? names.join(' and ')
      : `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`;

// Nome da área no meio da frase: inicial minúscula ("de tumores mamários", não "de Tumores mamários")
const lowerFirst = (s) => s.charAt(0).toLocaleLowerCase() + s.slice(1);

export default {
  code: 'en',
  htmlLang: 'en',
  short: 'EN',
  name: 'English',

  // Datas e cidade de cada edição (edição no ar: ../edition.js). Edição sem entrada aqui: o banner sai sem data e cidade.
  editions: {
    2026: { dates: 'December 12 – 15, 2026', city: 'New Orleans, Louisiana' },
  },

  // Textos do banner: provisórios, aguardando aprovação
  event: {
    tagline: 'Hematology • Expert analysis', // linha de rodapé do banner, ao lado da cidade (provisório)
    title: ['Advances in hematology,', 'as read by experts'],
    lead: 'Video analysis of the key studies and advances presented at the congress, with a focus on what may change clinical practice.',
    heroAlt: '',
  },

  // Empresa que solicita a cobertura (logo em content.js → partnerLogo)
  partner: 'AstraZeneca',

  nav: { home: 'Home', destaques: 'Coverage highlights', pos: 'Post-ASH', posNote: 'Content available after the congress' },

  topics: {
    'area-1': 'Area 1',
    'area-2': 'Area 2',
    'area-3': 'Area 3',
    'area-4': 'Area 4',
    'area-5': 'Area 5',
    outros: 'Other topics',
  },

  // Especialidades reunidas em "Outros temas": botões que filtram os conteúdos da página
  subtopics: {
    'tema-1': 'Topic 1',
    'tema-2': 'Topic 2',
    'tema-3': 'Topic 3',
  },

  // Apresentação de cada área (página da área), pelo id da área:
  // { 'area-1': { intro: 'Texto de abertura.', points: ['Tema em foco'], headlines: ['Título de notícia (até 4)'] } }
  areas: {},

  // Especialistas dos vídeos, pelo id do cadastro em content.js → people:
  // { 'nome-sobrenome': { specialty: 'Hematologia', role: 'Cargo e instituição', bio: 'Minicurrículo.', coi: 'Conflitos declarados.' } }
  people: {},

  // Título e texto de apoio de cada vídeo: { id: ['Título', 'Texto de apoio.'] }. Provisórios até a lista final.
  content: {
    'video-1': ['Video title 1', 'Supporting text to be confirmed.'],
    'video-2': ['Video title 2', 'Supporting text to be confirmed.'],
    'video-3': ['Video title 3', 'Supporting text to be confirmed.'],
    'video-4': ['Video title 4', 'Supporting text to be confirmed.'],
    'pos-ash': ['Video title', ''],
  },

  finalSynthesis: {
    eyebrow: 'Final synthesis',
    title: ['The key highlights,', 'in two conversations.'],
    description: 'At the close of the congress, an integrated view of the most impactful topics and what changes in practice.',
  },

  // Seção da Home com os depoimentos em vídeo dos associados (nome da seção aguardando aprovação)
  associates: {
    title: 'ASH through our members’ eyes',
    sub: 'Members share what they saw at the congress and what they take back to practice.',
    watch: (name) => `Watch ${name}’s testimonial`,
    close: 'Close',
    more: 'See more posts',
    filters: 'Content type',
    all: 'All',
    photos: 'Photos',
    videos: 'Videos',
    see: (name) => `See ${name}’s post`,
    empty: 'No posts of this type yet.',
    place: EVENT_NAME,
    // [cargo e cidade (vazio = o do cadastro de especialistas), legenda]
    items: {},
  },

  // Required disclaimers (Medscape guidelines, English version from the PDF)
  // Aviso do topo da página: começo da frase; o nome da instituição (partner) entra em seguida, em outra linha no celular
  topDisclosure: 'Developed by Medscape at the request of',
  sponsorLine: (names) => `Developed by Medscape at the request of ${join(names)}`,
  // Tradução do texto do briefing em português: aguardando aprovação
  footerDisclaimer: (names) =>
    `Conference coverage was developed by Medscape at the request of ${join(names)}. ` +
    `${join(names)} carried out a full medical approval process to ensure compliance with applicable regulations. ` +
    'No part of this coverage may be reproduced, in whole or in part, without the permission of the publisher. ' +
    'The opinions and views expressed do not necessarily represent those of Medscape, its publishers, advisers, or advertisers.',

  // Rodapé mínimo: marcas, público, privacidade e o aviso obrigatório (acima)
  footer: {
    developedBy: 'Developed by',
    requestedBy: 'At the request of',
    audience: 'Content intended exclusively for healthcare professionals.',
    privacy: { label: 'Privacy policy', href: 'https://www.medscape.com/public/privacy' },
    newTab: '(opens in a new tab)',
  },

  ui: {
    skip: 'Skip to content',
    homePartner: (name) => `${name}, back to home`,
    homeMedscape: 'Medscape, back to home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main',
    language: 'Language',

    exploreCoverage: `Follow ${EVENT_NAME}`,
    videosCount: (n) => `${n} coverage videos`,
    atYourPace: 'Explore at your own pace.',
    seeAll: 'See all',

    textsTitle: 'Coverage news',
    textsSub: 'The studies and debates of the congress, with expert insight.',

    areasTitle: 'Explore by therapeutic area',
    areasSub: 'Pick the topic of your practice and see what the coverage has on it.',
    areaVideos: (n) => `${n} ${n === 1 ? 'video' : 'videos'}`,
    areaNews: (n) => `${n} ${n === 1 ? 'news story' : 'news stories'}`,
    // Contagem completa para leitores de tela: "2 vídeos · 1 notícia"
    areaCount(videos, news) {
      return [videos && this.areaVideos(videos), news && this.areaNews(news)].filter(Boolean).join(' · ');
    },
    areaCta: (topic) => `See ${lowerFirst(topic)} content`,
    coverageOf: (name) => `${name} coverage`,
    readTime: (t) => `${t} read`,
    exploreByTopic: 'Explore by topic',

    featuredTitle: 'Coverage highlights',
    featuredSub: `Video analysis, straight from ${EVENT_NAME}`,
    featuredLead: 'Video analyses with experts, published during the congress.',
    watchNow: 'Watch',
    featuredLabel: 'Highlights',
    goToVideo: 'Go to video',
    previous: 'previous',
    next: 'next',

    part: (n) => `Part ${n}`,
    duration: 'Duration',

    exploreTitle: 'Explore by topic',
    exploreSub: 'Selected content, including videos and analysis, to dive deeper into the topics that matter most to you.',
    all: 'All',
    moreTopics: 'More topics',
    filterByTopic: 'Filter by topic',
    topicsLabel: 'Topics',
    emptyTopic: 'No content has been published for this topic yet.',
    goToContent: 'Go to content',

    supportersTitle: 'Supporters',

    // Content nature (handoff): every card shows one of the two before the click
    editorial: 'Editorial',
    sponsoredBadge: 'Sponsored content',
    coverage: 'Coverage',

    // Therapeutic area
    topicKicker: 'Therapeutic area',
    topicSub: 'Selected news, videos and analysis',
    topicCommittee: 'Scientific committee',
    topicHeadlines: 'Coverage news',
    topicHeadlinesCta: (topic) => `See ${lowerFirst(topic)} news`,
    topicAreas: 'Other therapeutic areas',
    topicSubtopics: 'Specialties',
    topicAllSubtopics: 'All',
    topicFocus: 'In focus in this area',
    topicUpdated: (d) => `Updated ${d}`,
    topicRelatedSub: 'Videos and news from other areas of the coverage.',
    topicHighlight: 'Highlight',
    newsHeading: 'News',
    videosHeading: 'Videos',
    topicEmpty: 'No content has been published in this area yet.',
    backToTopic: (t) => `Back to ${t}`,
    seeAllNews: 'See all news',
    seeAllVideos: 'See all videos',

    // Format listings
    newsListTitle: 'News',
    newsListSub: 'Editorial and sponsored updates from the coverage',
    videoListTitle: 'Videos',
    videoListSub: 'Highlights, interviews and commentary',
    filterByArea: 'Filter by therapeutic area',
    resultsCount: (n) => `${n} ${n === 1 ? 'item' : 'items'}`,
    listingEmpty: 'No content in this area yet.',

    // Final synthesis
    synthesisTitle: (name) => `${name} final synthesis`,
    synthesisSub: 'Key messages by therapeutic area',
    synthesisAreasSub: 'What to expect from each area at the congress, in a few lines, with the way to its videos and news.',
    explore: 'Explore',

    // Search
    searchTitle: 'Search the coverage',
    searchPlaceholder: 'Topic, study or expert',
    searchButton: 'Search',
    searchResults: (n) => `${n} ${n === 1 ? 'result' : 'results'}`,
    searchEmpty: (q) => `Nothing found for “${q}”. Try another term or explore by therapeutic area.`,
    searchPrompt: 'Search by topic, study or expert across the coverage videos and news.',

    // Before the content is published
    soon: 'Coming soon',
    soonText: 'The coverage videos and news will be published during the congress.',
    soonTopic: (topic) => `The ${lowerFirst(topic)} videos and news will be published during the congress.`,
    soonVideos: 'The coverage videos will be published during the congress.',
    soonNews: 'The coverage news will be published during the congress.',
    soonSynthesis: 'The two closing conversations will be published at the end of the congress.',
    soonSearch: 'The coverage content has not been published yet. Come back during the congress to search.',
    soonStarts: (date) => `Coverage starts on ${date}`,
    soonEnds: (date) => `At the close of the congress, on ${date}`,
    soonLive: 'Coverage underway',
    soonDay: (day, total) => `Day ${day} of ${total}`,
    soonCountdown: (n) => (n === 1 ? '1 day to go' : `${n} days to go`),
    soonWhat: 'What’s coming',
    soonItems: [
      { key: 'videos', title: 'Videos', text: 'The highlights of each area, discussed by experts.' },
      { key: 'noticias', title: 'News', text: 'The congress studies and debates, with the experts’ take.' },
    ],
    soonExpected: (date) => `Expected on ${date}`,
    soonCalendar: 'Congress days',
    soonToday: 'Today',
    soonFirst: 'Start',
    soonLast: 'Closing',

    video: 'Video',
    text: 'News',
  },

  page: {
    back: 'Back to coverage',

    // Página de vídeo: compartilhamento, abas, transcrição e "Sobre o vídeo" (traduções aguardando aprovação)
    share: 'Share',
    shareEmail: 'Email',
    shareWhatsapp: 'WhatsApp',
    shareEmailLabel: 'Share by email',
    shareWhatsappLabel: 'Share on WhatsApp',
    shareText: (title, name) => `${title} | ${name} coverage, Medscape`,
    tabs: 'Video content',
    transcript: 'Video transcript',
    transcriptSoon: 'The full transcript will be published along with the video (in Portuguese).',
    downloadPdf: 'Download PDF',
    downloadBusy: 'Generating PDF…',
    downloadError: 'The PDF could not be generated. Please try again.',
    downloadSoon: 'PDF available once the transcript is published.',
    about: 'About the video',
    aboutIntro: (name, sponsor) => [
      `This video is part of the special coverage of ${name}, developed by Medscape at the request of ${sponsor}.`,
      'It brings together expert analysis and perspectives on the key studies, scientific advances, and updates presented during the congress, with a focus on their possible implications for clinical practice.',
    ],
    coiTitle: 'Conflict of interest and editorial responsibility statement',
    coiText: (sponsor) => [
      'The participating experts disclose their potential conflicts of interest, in accordance with the transparency policies applicable to this activity.',
      `The medical opinions, analyses, and recommendations presented in this video are the sole responsibility of the respective experts and do not necessarily reflect the position of Medscape, its publishers, advisers, or ${sponsor}.`,
      'The content is exclusively scientific and educational and does not replace individualized clinical assessment or the professional judgment of the treating physician.',
    ],
    speakersTitle: 'Participating experts',
    bio: 'Short biography',
    coi: 'Conflicts of interest',
    postTitle: (name) => `Post-${name}`,
    postSoon: 'Content available after the congress.',
    videoKicker: 'Coverage video',
    textKicker: 'Coverage news',
    synthesisKicker: 'Final synthesis',
    watch: (title) => `Watch: ${title}`,
    newsSoonTitle: 'The full article will be published during the congress',
    newsSoon: 'Specialists publish their analysis throughout the congress, with what changes in clinical practice.',
    newsSoonCta: (topic) => `See everything on ${lowerFirst(topic)}`,
    hlCount: (n) => `${n} highlighted ${n === 1 ? 'study' : 'studies'}`,
    hlMinutes: (n) => `${n} min read`,
    hlPosition: (i, n) => `Study ${i} of ${n}`,
    hlPrev: 'Previous study',
    hlNext: 'Next study',
    hlClose: 'Close',
    videoSoon: 'The video will be published here as soon as the final recording is approved.',
    supportedBy: 'Sponsored content',
    // Sponsored content page: disclosure at the top, above the title (handoff, p. 10)
    sponsoredBy: 'Sponsored content by',
    sponsoredNote: 'Material developed for healthcare professionals',
    byline: (name, date) => `${name} coverage • ${date}`,

    expert: 'Expert',
    experts: 'Experts',
    aboutVideo: 'About this video',
    aboutText: 'About this story',
    place: 'Location',
    dates: 'Dates',
    formatValue: 'Video with transcript',
    format: 'Format',
    topic: 'Topic',
    event: 'Event',
    related: 'Keep exploring',
    relatedSub: (name) => `More videos and analysis from the ${name} coverage.`,
    notFound: 'Content not found',
    notFoundText: 'The link may be incomplete, or the content has not been published yet.',
    notFoundBack: 'Back to coverage',
    notFoundSearch: 'Search the coverage',
    notFoundAreas: 'Or choose a therapeutic area',
    // Modelo mostrado enquanto o vídeo está "Em breve" e os especialistas não foram informados; some ao publicar o vídeo
    placeholderSpeaker: {
      placeholder: true,
      name: 'Dr. [Full name of the expert]',
      specialty: '[Medical specialty]',
      role: '[Title and institution]',
      bio: '[Brief overview of career, academic background, institutional role, and experience in the area related to the video.]',
      coi: '[Conflicts disclosed by the expert, or absence of conflicts, per individual statement.]',
    },
    body: (eventName) => [
      `This story follows the main ${eventName} presentations on the topic and organizes the points that stood out most to the experts during the congress.`,
      'It highlights study design, the results presented, and the questions that remain open, with a focus on what may be incorporated into clinical practice.',
      'Full text of the story to be added once the final content is approved.',
    ],
  },
};
