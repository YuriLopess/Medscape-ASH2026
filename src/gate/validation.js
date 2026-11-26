/*
  Regras do formulário de cadastro/login. Cada uma espelha a função de mesmo papel em
  backend/web/server/bootstrap.php: se mudar aqui, mude lá (e vice-versa). As mensagens também
  são as mesmas que register.php devolve por campo.
*/
import { commonPasswords } from './data/commonPasswords.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CRM_PATTERN = /^\d{4,8}$/;

// Mesmos limites do servidor (register.php) e das colunas do banco.
export const NAME_MAX = 100;
export const EMAIL_MAX = 190;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 200;
export const CRM_MAX = 8;

/** Letras (com acentos), espaço, hífen, apóstrofo ou ponto; pelo menos 2 letras. Espelha valid_name(). */
export function validateName(value, label) {
  const v = value.trim();
  if (!v) return `Informe o ${label}.`;
  const lettersOnly = /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(v);
  if (!lettersOnly || (v.match(/\p{L}/gu) ?? []).length < 2) return `Use apenas letras no ${label} (mínimo de 2).`;
  return undefined;
}

export function validateEmail(value) {
  const v = value.trim();
  if (!v) return 'Informe o e-mail.';
  if (!EMAIL_PATTERN.test(v)) return 'Informe um e-mail válido.';
  return undefined;
}

/** Está na lista de senhas comuns, ou contém a parte do e-mail antes do @ (4+ caracteres). Espelha password_too_obvious(). */
export function passwordTooObvious(senha, email) {
  const lower = senha.toLowerCase();
  if (commonPasswords.includes(lower)) return true;
  const local = email.trim().toLowerCase().split('@')[0] ?? '';
  return local.length >= 4 && lower.includes(local);
}

/** 8+ caracteres com uma letra e um dígito, e não óbvia demais. Espelha valid_password(). */
export function validatePassword(senha, email) {
  if (senha.length < PASSWORD_MIN || !/\p{L}/u.test(senha) || !/\d/.test(senha)) {
    return `A senha deve ter de ${PASSWORD_MIN} a ${PASSWORD_MAX} caracteres, com letras e números.`;
  }
  if (passwordTooObvious(senha, email)) return 'Essa senha é fácil de adivinhar. Escolha outra.';
  return undefined;
}

/**
 * Não há consulta oficial de CRM, então isso só pega números digitados pra passar pelo campo:
 * tudo zero, um dígito repetido ou sequência (123456 / 987654). Espelha crm_looks_made_up().
 */
export function crmLooksMadeUp(crm) {
  if (/^0+$/.test(crm) || /^(\d)\1+$/.test(crm)) return true;
  const steps = [...crm].slice(1).map((d, i) => Number(d) - Number(crm[i]));
  return steps.every((s) => s === 1) || steps.every((s) => s === -1);
}

export function validateCrm(crm) {
  if (!CRM_PATTERN.test(crm)) return 'O CRM deve ter entre 4 e 8 dígitos.';
  if (crmLooksMadeUp(crm)) return 'Confira o número do CRM.';
  return undefined;
}

/**
 * Erros do formulário inteiro no modo atual ('cadastro' ou 'entrar'), como { campo: mensagem }.
 * Objeto vazio significa válido.
 */
export function validateForm(form, mode) {
  const errors = { email: validateEmail(form.email) };
  if (mode === 'entrar') {
    if (!form.senha) errors.senha = 'Informe a senha.';
  } else {
    errors.nome = validateName(form.nome, 'nome');
    errors.sobrenome = validateName(form.sobrenome, 'sobrenome');
    errors.senha = validatePassword(form.senha, form.email);
    if (!form.confirmarSenha) errors.confirmarSenha = 'Confirme a senha.';
    else if (form.confirmarSenha !== form.senha) errors.confirmarSenha = 'As senhas não conferem.';
    errors.crm = validateCrm(form.crm);
    if (!form.uf) errors.uf = 'Selecione o estado (UF).';
    if (!form.especialidade) errors.especialidade = 'Selecione a especialidade.';
    if (!form.declaracao) errors.declaracao = 'É necessário confirmar a declaração para continuar.';
  }
  // Descarta as entradas que ficaram undefined, pra "sem chaves" seguir significando "válido".
  return Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg));
}
