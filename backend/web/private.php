<?php
// Entrega os scripts e estilos do app só pra quem tem sessão válida. O .htaccess roteia
// a URL pública /private/* pra cá; os arquivos ficam em private-files/, que o Apache nunca
// serve diretamente (uma pasta negada em /private/ também bloquearia esta rota).
declare(strict_types=1);

require __DIR__ . '/server/bootstrap.php';

const PRIVATE_TYPES = [
    'js' => 'text/javascript; charset=utf-8',
    'css' => 'text/css; charset=utf-8',
];

if (current_session_or_null() === null) {
    http_response_code(403);
    exit;
}

$base = realpath(__DIR__ . '/private-files');
$requested = $_GET['f'] ?? '';
$path = is_string($requested) && $base !== false ? realpath($base . '/' . $requested) : false;
$ext = $path ? strtolower(pathinfo($path, PATHINFO_EXTENSION)) : '';

if (!$path || strpos($path, $base . DIRECTORY_SEPARATOR) !== 0 || !is_file($path) || !isset(PRIVATE_TYPES[$ext])) {
    http_response_code(404);
    exit;
}

$mtime = (int) filemtime($path);
header('Cache-Control: private, max-age=86400');
header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');
$since = strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '');
if ($since !== false && $since >= $mtime) {
    http_response_code(304);
    exit;
}

// Versão já comprimida no build (.br/.gz ao lado do original), bem menor que a compressão do servidor.
// Com Content-Encoding definido, o Apache não comprime de novo.
header('Vary: Accept-Encoding');
$accept = (string) ($_SERVER['HTTP_ACCEPT_ENCODING'] ?? '');
foreach (['br' => '.br', 'gzip' => '.gz'] as $encoding => $suffix) {
    if (preg_match('/\b' . $encoding . '\b/i', $accept) && is_file($path . $suffix)) {
        $path .= $suffix;
        ini_set('zlib.output_compression', '0'); // senão o PHP comprimiria de novo o que já vem comprimido
        header('Content-Encoding: ' . $encoding);
        break;
    }
}

header('Content-Type: ' . PRIVATE_TYPES[$ext]);
header('Content-Length: ' . filesize($path));
header('X-Content-Type-Options: nosniff');
readfile($path);
