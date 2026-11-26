import { cpSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { brotliCompressSync, constants as zlib, gzipSync } from 'node:zlib';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { medicalSpecialties } from './src/gate/data/medicalSpecialties.js';
import { EVENT_NAME } from './src/data/edition.js';
import { commonPasswords } from './src/gate/data/commonPasswords.js';

const path = (p) => fileURLToPath(new URL(p, import.meta.url));
const OUT_DIR = path('./dist');

// Endereço público do site, com barra no fim (ex.: SITE_URL=https://ash2026.exemplo.com/ npm run build).
// WhatsApp, LinkedIn etc. só mostram a imagem de compartilhamento se ela tiver o endereço completo.
const siteUrl = process.env.SITE_URL ? process.env.SITE_URL.replace(/\/?$/, '/') : '';
const siteUrlPlugin = {
  name: 'site-url',
  // __EVENT__: nome do evento (src/data/edition.js)
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl).replaceAll('__EVENT__', EVENT_NAME),
};

const resolve = {
  // "@/components/ui/..." → src/components/ui/... (padrão shadcn)
  alias: { '@': path('./src') },
};

// Copia o backend PHP pra junto das páginas geradas, pra dist/ ser exatamente o que vai pro servidor.
function copyBackend() {
  return {
    name: 'copy-backend',
    apply: 'build',
    closeBundle() {
      // As páginas referenciam /private/*, que private.php serve de private-files/ após checar a sessão.
      renameSync(`${OUT_DIR}/private`, `${OUT_DIR}/private-files`);
      precompress(`${OUT_DIR}/private-files`);
      cpSync(path('./backend/web'), OUT_DIR, {
        recursive: true,
        // Credenciais de produção vivem só no servidor e nunca podem ser sobrescritas por um deploy.
        filter: (src) => !src.endsWith('config.local.php'),
      });
      // O servidor valida contra as mesmas listas que a tela usa.
      writeFileSync(`${OUT_DIR}/server/especialidades.json`, JSON.stringify(medicalSpecialties));
      writeFileSync(`${OUT_DIR}/server/senhas-comuns.json`, JSON.stringify(commonPasswords));
    },
  };
}

// A imagem grande do topo é a maior coisa da primeira tela. Sem aviso, o navegador só a descobre depois de
// baixar e rodar o JavaScript do app; com o preload ela começa a baixar junto com ele. Como as rotas são
// por hash (o servidor não sabe qual página foi aberta), um script curto no <head> escolhe a imagem:
// imagem do banner na Home, arte das páginas internas nos vídeos (#/videos/<slug>) e no Pós-ASH (#/pos-ash).
// Mesmos tamanhos e "sizes" da tela: Media.jsx ('front-media') e ContentPage.jsx (ART_SIZES), em WebP.
// page: a página que abre o app (home.html com login; index.html sem login) — a tela de cadastro não usa.
function routePreload(page) {
  const variants = JSON.parse(readFileSync(path('./src/data/image-variants.json'), 'utf-8'));
  const srcset = (src) => {
    const widths = variants[src];
    if (!widths) return null; // imagem ainda não existe: sem preload
    const original = widths[widths.length - 1];
    return widths.map((w) => `${src.replace(/\.(jpg|webp)$/, w === original ? '.webp' : `-${w}.webp`)} ${w}w`).join(', ');
  };
  const preload = (src, sizes) => {
    const s = srcset(src);
    return s && { s, z: sizes };
  };
  const hero = preload('images/hero.jpg', '(max-width: 640px) 170vw, (max-width: 900px) 135vw, (max-width: 1280px) 100vw, 88vw');
  const art = preload('images/cobertura-arte.jpg', '(max-width: 900px) 100vw, 1100px');
  // Mesma leitura do hash que src/hooks/useRoute.js
  const script = `<script>(function () {
      var h = location.hash, parts = h.indexOf('#/') === 0 ? h.slice(2).split('?')[0].split('/').filter(Boolean) : [];
      var img = !parts.length ? ${JSON.stringify(hero)}
        : parts[0] === 'pos-ash' || (parts[0] === 'videos' && parts.length > 1) ? ${JSON.stringify(art)}
        : parts[0] === 'videos' ? ${JSON.stringify(hero)} : null;
      if (!img) return;
      var l = document.createElement('link');
      l.rel = 'preload'; l.as = 'image'; l.type = 'image/webp';
      l.setAttribute('fetchpriority', 'high'); l.setAttribute('imagesrcset', img.s); l.setAttribute('imagesizes', img.z);
      document.head.appendChild(l);
    })();</script>`;
  // Logo no início do <head>: depois das folhas de estilo, o script esperaria o CSS chegar (~1 s a mais)
  return {
    name: 'route-preload',
    transformIndexHtml: (html, ctx) =>
      ctx.filename.replace(/\\/g, '/').endsWith(`/${page}`) ? html.replace('<head>', `<head>\n    ${script}`) : html,
  };
}

// Os scripts e estilos do app passam por private.php, e a compressão do servidor é fraca (o app chegava
// com 121 KB). Aqui eles saem já comprimidos no máximo (.br e .gz ao lado do original, ~65 KB em Brotli);
// private.php entrega a versão que o navegador aceitar.
function precompress(dir) {
  for (const name of readdirSync(dir)) {
    if (!/\.(js|css)$/.test(name)) continue;
    const data = readFileSync(`${dir}/${name}`);
    writeFileSync(`${dir}/${name}.br`, brotliCompressSync(data, { params: { [zlib.BROTLI_PARAM_QUALITY]: 11 } }));
    writeFileSync(`${dir}/${name}.gz`, gzipSync(data, { level: 9 }));
  }
}

// Sem login (padrão: `npm run dev` / `npm run build`): o index.html carrega o app direto, sem a tela de
// cadastro/login nem backend PHP — é o site estático.
function appWithoutGate() {
  return {
    name: 'app-without-gate',
    // 'pre': precisa rodar antes do Vite ler o <script> do HTML, senão a entrada continua sendo o gate
    transformIndexHtml: { order: 'pre', handler: (html) => html.replace('/src/gate/main.jsx', '/src/main.jsx') },
  };
}

const APP_ENTRY = path('./src/main.jsx').replace(/\\/g, '/');
const isAppEntry = (id) => !!id && id.replace(/\\/g, '/') === APP_ENTRY;

// Com login (`npm run build:login` / `npm run dev:login`): servidor da Medscape com cadastro e login
// (index.php + backend PHP + banco).
const withLogin = {
  plugins: [react(), tailwindcss(), siteUrlPlugin, routePreload('home.html'), copyBackend()],
  // Raiz absoluta: o site fica na raiz do domínio, e a 404.html é servida em qualquer caminho.
  base: '/',
  resolve,
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    rollupOptions: {
      // index.html é a tela pública de cadastro/login; home.html só é entregue pelo index.php
      // depois do login; 404.html é a página de erro (ErrorDocument do Apache).
      input: {
        index: path('./index.html'),
        home: path('./home.html'),
        notFound: path('./404.html'),
      },
      output: {
        // Código só do app vai pra private/, que o servidor só entrega com sessão válida. O que o gate
        // e o app compartilham (React, fontes) fica num chunk à parte, em assets/, e é público.
        // Checagem também pelo módulo src/main.jsx dentro do chunk, caso o Rollup tire o código do
        // app da entrada "home" e o coloque num chunk com o nome do arquivo (main).
        entryFileNames: (chunk) => (chunk.name === 'home' ? 'private/[name]-[hash].js' : 'assets/[name]-[hash].js'),
        chunkFileNames: (chunk) =>
          chunk.isDynamicEntry || chunk.moduleIds.some(isAppEntry) ? 'private/[name]-[hash].js' : 'assets/[name]-[hash].js',
        assetFileNames: (asset) => {
          const name = asset.names?.[0] ?? asset.name ?? '';
          return name === 'main.css' || name === 'home.css' ? 'private/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    // `npm run dev` fala com a API PHP rodando no Docker (docker compose up). O proxy reescreve
    // o Host pra localhost:8083 mas manteria o Origin como localhost:5173, que a checagem de
    // mesma origem da API (read_json_post) recusa — então o Origin é removido aqui. Só em dev;
    // produção não tem proxy.
    proxy: {
      '/api': {
        target: 'http://localhost:8083',
        changeOrigin: true,
        configure: (proxy) => proxy.on('proxyReq', (req) => req.removeHeader('origin')),
      },
    },
  },
};

// Sem login (padrão): base relativo, o build funciona aberto de qualquer pasta ou subcaminho.
const publico = {
  plugins: [react(), tailwindcss(), siteUrlPlugin, appWithoutGate(), routePreload('index.html')],
  base: './',
  resolve,
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: { index: path('./index.html'), notFound: path('./404.html') },
    },
  },
};

export default defineConfig(({ mode }) => (mode === 'login' ? withLogin : publico));
