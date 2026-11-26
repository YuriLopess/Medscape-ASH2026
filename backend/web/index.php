<?php
// Front controller do site (o .htaccess gerado pelo build manda / pra cá; as páginas do app são
// rotas por hash, #/..., então só existe essa URL): com sessão válida entrega o app; sem sessão,
// entrega a tela de cadastro/login — sem redirecionar, então o hash pedido volta depois do login.
// Exceção: o link sem login (?acesso=CÓDIGO, ex.: banner da Medscape) abre o site sem cadastro.
declare(strict_types=1);

require __DIR__ . '/server/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');

$session = current_session_or_null();

if ($session === null) {
    if (banner_code_valid($_GET['acesso'] ?? null)) {
        try {
            start_session(null, (int) app_config()['banner_session_days']);
            log_access(null, 'banner');
            // Tira o código da barra de endereço, pra ele não ser copiado junto com a página.
            header('Location: ' . url_without_code(), true, 302);
            exit;
        } catch (Throwable $e) {
            error_log('[ash] banner session failed: ' . $e->getMessage());
        }
    }
    readfile(__DIR__ . '/index.html');
    exit;
}

// Já com sessão, um link com o código só perde o código.
if (isset($_GET['acesso'])) {
    header('Location: ' . url_without_code(), true, 302);
    exit;
}

try {
    log_access($session['usuario_id'] === null ? null : (int) $session['usuario_id'], 'visita');
} catch (Throwable $e) {
    error_log('[ash] visit log failed: ' . $e->getMessage());
}

readfile(__DIR__ . '/home.html');

/** A URL pedida (mesma página), sem o parâmetro acesso. Mantém os outros (ex.: ?lang=en). */
function url_without_code(): string
{
    $path = (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
    $path = '/' . ltrim($path, '/\\'); // nunca "//host" nem "/\host": evita redirecionar pra outro site
    $query = $_GET;
    unset($query['acesso']);
    return $path . ($query ? '?' . http_build_query($query) : '');
}
