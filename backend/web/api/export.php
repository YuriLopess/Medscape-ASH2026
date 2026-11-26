<?php
// Exportação CSV para os relatórios da Medscape / patrocinadores, atrás de HTTP Basic.
//   /api/export.php?tipo=cadastros  — uma linha por pessoa cadastrada
//   /api/export.php?tipo=acessos    — uma linha por cadastro, login, entrada pelo banner e visita
declare(strict_types=1);

require __DIR__ . '/../server/bootstrap.php';

function basic_auth_credentials(): array
{
    if (isset($_SERVER['PHP_AUTH_USER'])) {
        return [(string) $_SERVER['PHP_AUTH_USER'], (string) ($_SERVER['PHP_AUTH_PW'] ?? '')];
    }
    // Em PHP-FPM/CGI o cabeçalho chega pela regra de rewrite do .htaccess.
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (stripos($header, 'Basic ') === 0) {
        $decoded = base64_decode(substr($header, 6), true);
        if ($decoded !== false && strpos($decoded, ':') !== false) {
            return explode(':', $decoded, 2);
        }
    }
    return ['', ''];
}

/**
 * Logins de administrador errados ficam em tentativas_login com este pseudo e-mail (nenhum
 * endereço real começa com "__"), então a exportação tem o mesmo bloqueio sem uma tabela nova.
 */
const ADMIN_ATTEMPT_KEY = '__admin_export__';

function export_text(int $status, string $text): void
{
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    echo $text;
    exit;
}

function require_admin(): void
{
    $c = app_config();
    $ip = client_ip();
    $minutes = (int) $c['login_lockout_minutes'];
    $pdo = db();

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM tentativas_login WHERE email = ? AND ip = ? AND criado_em > DATE_SUB(NOW(), INTERVAL ? MINUTE)');
    $stmt->execute([ADMIN_ATTEMPT_KEY, $ip, $minutes]);
    if ((int) $stmt->fetchColumn() >= (int) $c['login_max_failures_per_email']) {
        export_text(429, "Muitas tentativas. Aguarde $minutes minutos e tente novamente.");
    }

    [$user, $pass] = basic_auth_credentials();
    $ok = $c['admin_password_hash'] !== ''
        && hash_equals((string) $c['admin_user'], $user)
        && password_verify($pass, $c['admin_password_hash']);
    if ($ok) {
        $pdo->prepare('DELETE FROM tentativas_login WHERE email = ? AND ip = ?')->execute([ADMIN_ATTEMPT_KEY, $ip]);
        return;
    }

    // A primeira requisição do navegador vem sem credenciais (é ela que faz aparecer a caixa de
    // login), então só conta como falha uma requisição que de fato tentou usuário/senha.
    if ($user !== '' || $pass !== '') {
        $pdo->exec('DELETE FROM tentativas_login WHERE criado_em < DATE_SUB(NOW(), INTERVAL 1 DAY)');
        $pdo->prepare('INSERT INTO tentativas_login (email, ip) VALUES (?, ?)')->execute([ADMIN_ATTEMPT_KEY, $ip]);
    }
    header('WWW-Authenticate: Basic realm="ASH 2026 - exportacao", charset="UTF-8"');
    export_text(401, 'Acesso restrito.');
}

/** Impede que planilhas executem uma célula como fórmula (CSV injection). */
function csv_safe($value): string
{
    $value = (string) $value;
    return $value !== '' && strpos('=+-@' . "\t\r", $value[0]) !== false ? "'" . $value : $value;
}

try {
    require_admin();
} catch (Throwable $e) {
    error_log('[ash] export auth failed: ' . $e->getMessage());
    export_text(500, 'Não foi possível gerar a exportação.');
}

$exports = [
    'cadastros' => [
        ['id', 'nome', 'sobrenome', 'email', 'crm', 'uf', 'especialidade', 'crm_status', 'criado_em'],
        'SELECT id, nome, sobrenome, email, crm, uf, especialidade, crm_status, criado_em
         FROM usuarios ORDER BY id',
    ],
    'acessos' => [
        ['id', 'data_hora', 'evento', 'usuario_id', 'nome', 'sobrenome', 'email', 'crm', 'uf'],
        // LEFT JOIN: quem entra pelo banner não tem cadastro, então as colunas da pessoa vêm vazias.
        'SELECT a.id, a.criado_em, a.evento, u.id, u.nome, u.sobrenome, u.email, u.crm, u.uf
         FROM acessos a LEFT JOIN usuarios u ON u.id = a.usuario_id ORDER BY a.id',
    ],
];

$tipo = $_GET['tipo'] ?? '';
if (!is_string($tipo) || !isset($exports[$tipo])) {
    export_text(400, 'Use ?tipo=cadastros ou ?tipo=acessos.');
}
[$columns, $sql] = $exports[$tipo];

try {
    $rows = db()->query($sql);
} catch (Throwable $e) {
    error_log('[ash] export failed: ' . $e->getMessage());
    export_text(500, 'Não foi possível gerar a exportação.');
}

$filename = 'ash-2026-' . $tipo . '-' . date('Y-m-d-His') . '.csv';
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: no-store');

// BOM + ponto e vírgula, pra o Excel em português/espanhol abrir com acentos e colunas certos.
$out = fopen('php://output', 'w');
fwrite($out, "\xEF\xBB\xBF");
fputcsv($out, $columns, ';');
foreach ($rows->fetchAll(PDO::FETCH_NUM) as $row) {
    fputcsv($out, array_map('csv_safe', $row), ';');
}
fclose($out);
