# ASH · Medscape

Site em **React 18 + Vite** (JSX, Tailwind em partes), com rotas por hash (`#/tema/slug`), publicado por
FTP no servidor da Medscape.

O site fica atrás de cadastro/login de profissional de saúde (mesmo backend do HPN Eu Existo e do Opella
Hub: PHP puro com MariaDB). `tools/deploy.sh` publica com login por padrão;
`npm run dev`/`npm run build` geram o site aberto (sem login), útil para trabalhar no conteúdo.

```bash
npm install            # primeira vez
npm run dev            # site aberto em http://localhost:5173
npm run build          # gera dist/ sem login (site estático)
npm run dev:login      # com a tela de cadastro (a API precisa do Docker, ver abaixo)
npm run build:login    # gera dist/ com login: front + backend PHP + .htaccess
```

## Páginas

- **Home** (`#/`): banner, Destaques da cobertura (`#destaques`: um vídeo grande e três menores) e Apoiadores.
- **Vídeo** (`#/videos/<slug>`): vídeo e "Sobre o vídeo"; na lateral, compartilhamento (e-mail e WhatsApp), ficha e o botão da transcrição em PDF.
- **Pós-ASH** (`#/pos-ash`): mesma página, com "Conteúdo disponível após o congresso." até o vídeo entrar.

O site nasceu da estrutura do projeto SBOC/ESMO. As páginas de áreas, notícias, Síntese final e busca não existem nesta
cobertura e os componentes delas foram removidos; parte dos estilos e textos delas ainda está em `styles.css` e nos locales.

## Preencher o conteúdo

- `src/data/edition.js`: ano da edição. Muda o nome do evento no site inteiro. Datas e cidade só aparecem quando a edição
  tem datas ali e em `locales/<idioma>.js` → `editions`.
- `src/data/content.js`: os 4 vídeos (`featuredBase`), o do Pós-ASH (`postBase`), fotos dos especialistas (`people`),
  apoiador e logo (`SPONSOR`, `partnerLogo`). Um vídeo sem `videoSrc` aparece como "Em breve". Não há player externo
  (Vimeo etc.): o vídeo é arquivo do próprio site.
- `src/data/transcripts.js`: transcrição de cada vídeo. O PDF é gerado no navegador a partir dela; para baixar um PDF já
  aprovado, use `transcriptPdf` no vídeo.
- `src/data/locales/{pt,en,es}.js`: títulos dos vídeos (`content`), especialistas (`people`: especialidade, cargo,
  minicurrículo e conflitos), textos do banner, "Sobre o vídeo" e rodapé.
- `src/gate/CadastroPage.jsx` (`brand`): textos da tela de cadastro.
- Imagens: `public/images/hero.jpg` (banner), `cobertura-arte.jpg` (arte das páginas internas), `videos/*.jpg` (capas) e
  `logos/astrazeneca.png`; depois, `python scripts/gerar-variantes.py`. Os arquivos de origem, em alta, ficam em
  `imagens-originais/` (fora do site; o `LEIAME.md` de lá diz qual é qual). `hero.jpg` é o original do banner com 120 px de
  céu a mais no alto (1914 × 942), para a cidade não ficar atrás do título. As faixas do banner (`Hero.jsx`) usam as coordenadas dessa foto: ao trocar, redesenhar; o painel azul do banner (`src/front.css`) se funde com a
  esquerda dela, então uma foto nova precisa ter essa área calma, sem nada importante.

### Antes de publicar (aguardando o cliente)

- Edição (no ar: ASH 2026; o briefing dizia 2027) e frase "Desenvolvido pela Medscape a pedido da AstraZeneca".
- Títulos, textos de apoio, vídeos, transcrições e especialistas; textos do banner; traduções em inglês e espanhol.
- Logo oficial da AstraZeneca e imagens definitivas.

## Login / acesso

- `/` é atendido pelo `index.php`: **sem sessão**, entrega a tela de cadastro/login (`src/gate/`,
  construída em `index.html`); **com sessão**, entrega o app (`home.html`). Como as páginas são rotas
  por hash, não há redirecionamento: um link direto pra `/#/videos/algum-video` (ou com `?lang=en`)
  volta pro mesmo lugar depois do login.
- O código e os estilos do app ficam em `private-files/` e só saem por `/private/*` (via `private.php`)
  pra quem tem sessão válida — o bundle do app não é servido sem login. React e fontes, que a tela de
  cadastro também usa, ficam em `assets/` (públicos). Imagens (`public/images/`) são públicas.
- O cadastro pede nome, sobrenome, e-mail, senha (8 a 200 caracteres, letras e números, gravada só
  como hash bcrypt), CRM, UF e especialidade, mais a declaração de ser profissional de saúde. Regras
  iguais na tela (`src/gate/validation.js`) e no servidor (`backend/web/server/bootstrap.php`), que
  devolve o erro de cada campo pra aparecer embaixo dele. Quem já tem cadastro entra com e-mail + senha.
  A sessão dura 30 dias (cookie `ash_session`). Ainda não há botão "Sair" no app (a API `/api/logout.php` existe).
- **Link sem login (banner da Medscape):** `/?acesso=CÓDIGO` entra direto, sem cadastro: sessão anônima
  de 1 dia, registrada em `acessos` como `banner`. O servidor tira o código da barra de endereço na
  entrada. Os códigos válidos ficam só em `banner_codes` no `config.local.php` (mínimo de 16 caracteres).
  Local (Docker): http://localhost:8083/?acesso=banner-local-0123456789.
- Depois de 5 senhas erradas pro mesmo e-mail (ou 20 do mesmo IP) em 15 minutos, o login fica
  bloqueado por 15 minutos. O cadastro aceita até 20 tentativas por IP por hora. Limites em
  `backend/web/server/config.php`.
- **CRM:** não há consulta oficial — o site só recusa números claramente inventados (zeros,
  dígito repetido, sequência) e grava todo cadastro como `nao_verificado`.
- Senhas óbvias são recusadas (lista em `src/gate/data/commonPasswords.js`, ou senha contendo o nome
  do e-mail) e a especialidade é conferida contra `src/gate/data/medicalSpecialties.js`. O build gera
  `server/senhas-comuns.json` e `server/especialidades.json` a partir dessas mesmas listas.
- Um campo "armadilha" (honeypot) invisível recusa cadastros de robô sem dizer o motivo. A API recusa
  requisições de outros sites (cabeçalho Origin) e envios maiores que 10 KB.
- Não há "Esqueci minha senha": o projeto não tem serviço de envio de e-mail.
- A tela de cadastro ainda é só em português (o app tem pt/en/es).

### Exportação CSV

Cadastros e acessos (cadastro, login, banner, visita), atrás de HTTP Basic (`admin_user` /
`admin_password_hash` no `config.local.php`; sem hash, fica fechada). 5 senhas erradas bloqueiam a
conexão por 15 minutos. Arquivos com `;` e UTF-8 com BOM, pra abrir direto no Excel.

- `/api/export.php?tipo=cadastros`
- `/api/export.php?tipo=acessos`

Local: `admin` / `hpn-local` (hash de teste reaproveitado do HPN, só no Docker).

## Rodando localmente

Requisitos: Node.js e Docker Desktop.

```bash
npm install
npm run build:login    # gera dist/ com login (front + backend PHP)
docker compose up -d   # Apache + PHP em http://localhost:8083, MariaDB na porta 3310
```

Portas diferentes das do HPN (8080/3307), do Opella (8081/3308) e da SBOC (8082/3309), pra rodar os quatro ao mesmo tempo.
O banco local é criado com `backend/database/schema.sql`. O container serve `dist/` direto: depois de
mudar o código, rode `npm run build:login` de novo.

`npm run dev:login` (porta 5173) também funciona com o Docker rodando — o proxy em `vite.config.js` encaminha
`/api` pra `localhost:8083`. Nesse modo não há PHP na frente das páginas: `/` é sempre a tela de
cadastro, e depois de entrar o navegador abre `/home.html` direto (dá pra abrir `/home.html` sem login
pra trabalhar no app).

## Publicação no servidor da Medscape

Mesmos requisitos do HPN e do Opella: PHP 7.4+ com `pdo_mysql`, Apache com `mod_rewrite` e
`AllowOverride All` (`mod_headers` recomendado), MariaDB 10.x (ou MySQL 5.7+), HTTPS.

1. `npm run build:login` (com `SITE_URL=https://.../` pra prévia de compartilhamento ter o endereço completo).
   Para o site aberto, sem login, `npm run build`: os passos 3 e 4 não se aplicam.
2. Enviar o **conteúdo** de `dist/` pra raiz pública por FTP. Confira abrindo `/server/config.php` no
   navegador — tem que dar 403.
3. Criar `server/config.local.php` no servidor (nunca vai no build; modelo abaixo), com permissão
   **644** (com 640 o Apache não lê e o site dá erro 500).
4. **Só no primeiro deploy**, criar as tabelas: envie `backend/database/instalar.php` pra raiz com um
   nome aleatório (ex.: `instalar-<aleatório>.php`) e `backend/database/schema.sql` pra `server/`. Abra o
   instalador uma vez (diagnóstico) e depois com `?criar=1`. Se o Apache não conseguir apagar os
   arquivos enviados por FTP, apague **pelo FTP** o instalador e o `schema.sql` em seguida.

Os passos 1 e 2 são o que o `tools/deploy.sh` faz — a Medscape só aceita FTP do IP da VPS, então o
build é enviado à VPS e o lftp espelha de lá. As senhas do FTP ficam só em `~/.ash.env` na VPS
(chmod 600; formato no cabeçalho do script):

```bash
SITE_URL=https://ENDERECO-DO-SITE/ VPS=root@179.236.232.166 VPS_KEY=~/.ssh/hpn_deploy bash tools/deploy.sh --dry-run   # simula
SITE_URL=https://ENDERECO-DO-SITE/ VPS=root@179.236.232.166 VPS_KEY=~/.ssh/hpn_deploy bash tools/deploy.sh             # publica (com login)
BUILD=build SITE_URL=... VPS=... bash tools/deploy.sh                                                                           # publica sem login
```

Modelo do `config.local.php`:

```php
<?php
return [
    'db_host' => 'localhost',
    'db_name' => '...',
    'db_user' => '...',
    'db_pass' => '...',
    // Exportação CSV. Hash: php -r "echo password_hash('a-senha', PASSWORD_DEFAULT);"
    'admin_user' => '...',
    'admin_password_hash' => '...',
    // Link sem login (/?acesso=CÓDIGO). Gere um aleatório, ex.:
    // node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))"
    'banner_codes' => ['...'],
];
```

## Estrutura

```
index.html                 Tela pública de cadastro/login (src/gate/main.jsx) + prévia de compartilhamento (og:*)
home.html                  App — só servido pelo index.php, com sessão válida (src/main.jsx)
404.html                   Página de erro (ErrorDocument do Apache), autocontida
backend/
  database/                schema.sql, instalar.php (instalador avulso pro servidor da Medscape)
  web/                     Copiado pra dist/ no build (vite.config.js) — vira a raiz do site
    index.php              Decide entre cadastro/login e o app, conforme a sessão
    private.php            Entrega os scripts/estilos do app (private-files/) com checagem de sessão
    api/                   login.php, register.php, logout.php, export.php
    server/                bootstrap.php, config.php (negados por .htaccess, nunca servidos direto)
docker/                    Dockerfile (Apache + PHP 8.1, espelha o servidor da Medscape)
docker-compose.yml         Ambiente local: Apache+PHP (8083) e MariaDB (3310)
tools/
  postbuild.mjs            Gera dist/.htaccess (com ou sem login)
  deploy.sh                Build + envio à VPS + FTP (lftp) pro servidor da Medscape
public/                    Favicon e images/ (servidos como estão): hero, cobertura-arte, videos/ (capas), logos/
imagens-originais/         Arquivos de origem das imagens, em alta (não vão para o site)
src/
  gate/                    Tela de cadastro/login
    main.jsx               Entrada da página pública
    CadastroPage.jsx/.css  Formulário (criar cadastro / entrar)
    Select.jsx/.css        Lista suspensa com busca (UF, especialidade)
    validation.js          Regras dos campos — espelho das de bootstrap.php
    api.js                 Chamadas a /api/*.php
    data/                  UFs, especialidades e senhas comuns (as duas últimas também vão pro servidor)
  main.jsx, App.jsx        App (entrada de home.html)
  components/              Cabeçalho, rodapé, Home (Hero, FeaturedVideos, Supporters), página de vídeo
                           (ContentPage, VideoTabs, ShareBar) e peças comuns (Media, Icons, Breadcrumb...)
  data/                    edition.js, content.js, transcripts.js, locales/ (pt, en, es), image-variants.json
  hooks/                   useRoute (rotas por hash), useReveal, useDismiss
  lib/                     transcriptPdf.js (PDF da transcrição), initials.js, utils.ts
  styles.css, front.css    Estilos gerais e da Home; theme-promo.css: paleta e fontes oficiais Medscape Promo;
                           motion.css: animações de entrada, rolagem e hover (curva e durações num lugar só)
scripts/                   gerar-variantes.py (tamanhos das imagens)
```
