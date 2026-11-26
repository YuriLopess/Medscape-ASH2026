// Roda depois do `vite build` (ver "build" no package.json): gera dist/.htaccess para Apache.
//
// O site usa rotas por hash (#/tema/slug, ver src/hooks/useRoute.js), então a única URL de página é "/"
// e não há lista de rotas a manter aqui (diferente do Opella).
//
// `--publico` (npm run build, o padrão): versão SEM login — "/" serve o index.html (app direto),
// endereço inexistente responde 404, dotfiles e listagem de pastas bloqueados, cache dos assets.
//
// Sem a flag (npm run build:login): o site inteiro fica atrás de login (ver README, seção "Login / acesso"): "/" passa por
// index.php, que decide servir a tela de cadastro (sem sessão) ou o app (com sessão). O .htaccess também
//   - nega acesso direto a home.html (só index.php pode servi-lo, depois de checar a sessão);
//   - roteia /private/* para private.php, que só libera os scripts/estilos do app com sessão válida;
//   - repassa o cabeçalho Authorization ao PHP (login da exportação CSV em PHP-FPM/CGI);
//   - bloqueia arquivos com ponto e a listagem de pastas (403);
//   - deixa os arquivos com hash no nome em cache por 1 ano.
import { writeFileSync } from 'node:fs';

const common = `<IfModule mod_mime.c>
  AddType font/woff2 .woff2
  AddType image/webp .webp
  AddType image/svg+xml .svg
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType image/webp "access plus 1 week"
  ExpiresByType image/jpeg "access plus 1 week"
  ExpiresByType image/png "access plus 1 week"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>
`;

const htaccessPublico = `# GERADO por tools/postbuild.mjs — não editar à mão.
Options -Indexes
DirectoryIndex index.html
AddDefaultCharset utf-8
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # arquivos e pastas com ponto (.htaccess, .git, .env…): 403
  RewriteRule (^|/)\\. - [F]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  <FilesMatch "^[\\w-]+-[\\w-]{8}\\.(js|css|woff2?)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "^index\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

${common}`;

const htaccessLogin = `# GERADO por tools/postbuild.mjs — não editar à mão.
DirectoryIndex index.php
Options -Indexes
AddDefaultCharset utf-8
ErrorDocument 404 /404.html

# home.html só é servido pelo index.php, depois de checar a sessão.
<Files "home.html">
  Require all denied
</Files>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule (^|/)\\. - [F]

  # repassa o Authorization ao PHP em PHP-FPM/CGI (login da exportação CSV)
  RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

  # scripts e estilos do app: passam pela checagem de sessão em private.php
  RewriteRule ^private/(.+)$ private.php?f=$1 [B,L,QSA]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"

  <FilesMatch "^[\\w-]+-[\\w-]{8}\\.(js|css|woff2?)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "^(index|home)\\.(html|php)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

${common}`;

const publico = process.argv.includes('--publico');
writeFileSync(new URL('../dist/.htaccess', import.meta.url), publico ? htaccessPublico : htaccessLogin);
console.log(`postbuild: dist/.htaccess (${publico ? 'site público, sem login' : 'site atrás do login'})`);
