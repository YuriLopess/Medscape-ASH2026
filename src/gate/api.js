/*
  Cliente da API PHP (backend/web/api/). Toda resposta vira { ok: true } ou
  { ok: false, error, message, fields? } — `fields` mapeia um campo do formulário à mensagem
  quando o servidor recusa campos específicos.
*/
const GENERIC_ERROR = 'Não foi possível concluir agora. Tente novamente em instantes.';

async function post(path, body) {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    // `npm run dev` faz proxy de /api pro Docker; um 502 ali significa que os containers estão parados.
    if (import.meta.env.DEV && res.status === 502) {
      return { ok: false, error: 'dev', message: 'Servidor local desligado: rode "docker compose up -d" e tente de novo.' };
    }
    const data = await res.json().catch(() => null);
    return { ok: false, error: data?.error ?? 'servidor', message: data?.message ?? GENERIC_ERROR, fields: data?.fields };
  } catch {
    return { ok: false, error: 'rede', message: 'Sem conexão com o servidor. Verifique sua internet e tente novamente.' };
  }
}

/** { nome, sobrenome, email, senha, crm, uf, especialidade, declaracao, site } — `site` é o honeypot. */
export const register = (data) => post('/api/register.php', data);
/** { email, senha } */
export const login = (data) => post('/api/login.php', data);
export const logout = () => post('/api/logout.php', {});
