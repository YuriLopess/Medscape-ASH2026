import { useRef, useState } from 'react';
import './CadastroPage.css';
import Select from './Select.jsx';
import variants from '../data/image-variants.json';
import { EDITION, EVENT_NAME } from '../data/edition.js';
import { brazilianStates } from './data/brazilianStates.js';
import { medicalSpecialties } from './data/medicalSpecialties.js';
import { login, register } from './api.js';
import { CRM_MAX, EMAIL_MAX, NAME_MAX, PASSWORD_MAX, validateForm } from './validation.js';

/*
  Tela pública de cadastro/login (entrada "index" do build). Fala só com a API PHP; quem decide
  se a pessoa vê esta tela ou o app é o index.php, pela sessão. Regras de cada campo em validation.js.
*/

const stateOptions = brazilianStates.map((s) => ({ value: s.uf, label: s.name }));
const specialtyOptions = medicalSpecialties.map((s) => ({ value: s, label: s }));

// Textos da metade da marca. Mesmos valores de content.js/locales, repetidos aqui para a tela pública não carregar o
// conteúdo do app. Só o logo da Medscape: o da empresa farmacêutica não fica colado ao dela (regra Medscape); a
// AstraZeneca aparece na frase do rodapé.
const kickers = { 2026: '12 a 15 de dezembro de 2026 • New Orleans, Louisiana' };
const brand = {
  partner: 'AstraZeneca',
  kicker: kickers[EDITION] ? `${EVENT_NAME} • ${kickers[EDITION]}` : EVENT_NAME,
  title: ['Os avanços da hematologia', 'na leitura de especialistas'],
  lead: 'Vídeos com análises dos principais estudos e avanços apresentados no congresso, com foco no que pode mudar a prática clínica.',
};

// Foto do banner da Home: só aparece quando existir e tiver passado por scripts/gerar-variantes.py
const heroWidths = variants['images/hero.jpg'];
const heroSrcSet = (ext) =>
  heroWidths.map((w, i) => `/images/hero${i === heroWidths.length - 1 ? '' : `-${w}`}.${ext} ${w}w`).join(', ');

/** O que o cadastro libera (lista do painel lateral). */
const highlights = [
  `Vídeos com análises de especialistas sobre o ${EVENT_NAME}`,
  'Transcrição completa de cada vídeo, com download em PDF',
  'Conteúdo Pós-ASH, disponível após o congresso',
];

const initialForm = {
  nome: '',
  sobrenome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
  crm: '',
  uf: '',
  especialidade: '',
  declaracao: false,
};

/** onEnter: chamado assim que o servidor abre uma sessão e a animação de saída termina. */
export default function CadastroPage({ onEnter }) {
  // 'cadastro' é o cadastro completo; 'entrar' é para quem já tem cadastro.
  const [mode, setMode] = useState('cadastro');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Honeypot: escondido de pessoas, só bots preenchem; o servidor recusa esses cadastros.
  const honeypotRef = useRef(null);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setServerError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const nextErrors = validateForm(form, mode);
    setErrors(nextErrors);
    setServerError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const email = form.email.trim();
    const result =
      mode === 'entrar'
        ? await login({ email, senha: form.senha })
        : await register({
            nome: form.nome,
            sobrenome: form.sobrenome,
            email,
            senha: form.senha,
            crm: form.crm,
            uf: form.uf,
            especialidade: form.especialidade,
            declaracao: form.declaracao,
            site: honeypotRef.current?.value ?? '',
          });
    if (result.ok) {
      setLeaving(true);
    } else {
      // O servidor nomeia os campos que recusou; mostra cada mensagem embaixo do campo.
      if (result.fields) setErrors(result.fields);
      setServerError(result);
      setSubmitting(false);
    }
  };

  const fieldClass = (field) => `cadastro-field${errors[field] ? ' has-error' : ''}`;
  const fieldMsg = (field) => errors[field] && <span className="cadastro-field-msg">{errors[field]}</span>;

  const textField = (field, label, props) => (
    <div className={fieldClass(field)}>
      <label htmlFor={`cad-${field}`}>
        {label}
        <span className="req">*</span>
      </label>
      <input id={`cad-${field}`} value={form[field]} onChange={(e) => setField(field, e.target.value)} {...props} />
      {fieldMsg(field)}
    </div>
  );

  const passwordField = (field, label, autoComplete) => (
    <div className={fieldClass(field)}>
      <label htmlFor={`cad-${field}`}>
        {label}
        <span className="req">*</span>
      </label>
      <div className="cadastro-password">
        <input
          id={`cad-${field}`}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          maxLength={PASSWORD_MAX}
          placeholder={autoComplete === 'new-password' ? 'Mín. 8, letras e números' : 'Sua senha'}
          value={form[field]}
          onChange={(e) => setField(field, e.target.value)}
        />
        {/* Um único estado pros dois campos de senha, pra mostrarem/esconderem juntos. */}
        <button
          type="button"
          className="cadastro-password-toggle"
          aria-controls={`cad-${field}`}
          aria-pressed={showPassword}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={() => setShowPassword((s) => !s)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
            {showPassword && <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
      {fieldMsg(field)}
    </div>
  );

  const selectField = (field, label, options) => (
    <div className={fieldClass(field)}>
      <label htmlFor={`cad-${field}`}>
        {label}
        <span className="req">*</span>
      </label>
      <Select
        id={`cad-${field}`}
        value={form[field]}
        onChange={(v) => setField(field, v)}
        options={options}
        placeholder="Selecione"
        hasError={!!errors[field]}
      />
      {fieldMsg(field)}
    </div>
  );

  const emailField = textField('email', 'E-mail', {
    type: 'email',
    autoComplete: 'email',
    maxLength: EMAIL_MAX,
    placeholder: 'nome@instituicao.com.br',
  });

  return (
    <div
      className={`cadastro-screen${leaving ? ' is-leaving' : ''}`}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) onEnter();
      }}
    >
      <div className="cadastro-shell">
        {/* Metade da marca: o mesmo banner da Home (azul, foto e arcos), parado enquanto o formulário rola */}
        <aside className="cadastro-hero">
          {/* WebP primeiro (bem mais leve); JPEG de reserva */}
          {heroWidths && (
            <picture>
              <source type="image/webp" srcSet={heroSrcSet('webp')} sizes="(max-width: 900px) 100vw, 50vw" />
              <img
                className="cadastro-hero-photo"
                src="/images/hero.jpg"
                srcSet={heroSrcSet('jpg')}
                sizes="(max-width: 900px) 100vw, 50vw"
                alt=""
                fetchPriority="high"
              />
            </picture>
          )}
          <svg className="cadastro-hero-arcs" viewBox="0 0 846 558" preserveAspectRatio="none" aria-hidden="true">
            <path d="M110 0 C 50 150, 60 330, 260 440 C 380 505, 500 540, 610 560" />
            <path d="M160 0 C 90 160, 100 320, 280 420 C 450 510, 700 545, 846 575" />
          </svg>

          <div className="cadastro-hero-inner">
            <div className="cadastro-logos">
              <img src="/images/logos/medscape-branco.png" alt="Medscape" width="698" height="160" />
            </div>

            <div className="cadastro-hero-main">
              <p className="cadastro-hero-kicker">{brand.kicker}</p>
              <p className="cadastro-hero-title">
                <span>{brand.title[0]}</span> <span>{brand.title[1]}</span>
              </p>
              <p className="cadastro-hero-lead">
                {brand.lead}
              </p>
            </div>

            <div className="cadastro-hero-foot">
              <p className="cadastro-highlights-label" id="cad-highlights">
                Com o cadastro, você acessa
              </p>
              <ul className="cadastro-highlights" aria-labelledby="cad-highlights">
                {highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

        </aside>

        <div className="cadastro-form-pane">
          <div className="cadastro-form-inner">
            <div className="cadastro-tabs" role="group" aria-label="Tipo de acesso">
              <button type="button" aria-pressed={mode === 'cadastro'} onClick={() => mode !== 'cadastro' && switchMode('cadastro')}>
                Criar cadastro
              </button>
              <button type="button" aria-pressed={mode === 'entrar'} onClick={() => mode !== 'entrar' && switchMode('entrar')}>
                Entrar
              </button>
            </div>
  
            <h1 className="cadastro-title">{mode === 'entrar' ? 'Entre na sua conta' : 'Crie seu cadastro'}</h1>
            <p className="cadastro-subtitle">
              {mode === 'entrar'
                ? 'Use o e-mail e a senha do seu cadastro.'
                : 'Conteúdo exclusivo para profissionais de saúde. Informe seus dados e seu registro profissional: o acesso é liberado assim que o cadastro é concluído.'}
            </p>
  
            <form className="cadastro-form" onSubmit={handleSubmit} noValidate>
              <div className="cadastro-hp" aria-hidden="true">
                <label htmlFor="cad-site">Deixe este campo em branco</label>
                <input ref={honeypotRef} id="cad-site" name="site" type="text" tabIndex={-1} autoComplete="off" />
              </div>
  
              {mode === 'entrar' ? (
                <div className="cadastro-group" key="entrar">
                  {emailField}
                  {passwordField('senha', 'Senha', 'current-password')}
                </div>
              ) : (
                <>
                  <div className="cadastro-group">
                    <h2 className="cadastro-group-tag">Identificação</h2>
                    <div className="cadastro-grid-2">
                      {textField('nome', 'Nome', { type: 'text', autoComplete: 'given-name', maxLength: NAME_MAX, placeholder: 'Seu nome' })}
                      {textField('sobrenome', 'Sobrenome', {
                        type: 'text',
                        autoComplete: 'family-name',
                        maxLength: NAME_MAX,
                        placeholder: 'Seu sobrenome',
                      })}
                    </div>
                    {emailField}
                    <div className="cadastro-grid-2 cadastro-grid-2--wide">
                      {passwordField('senha', 'Senha', 'new-password')}
                      {passwordField('confirmarSenha', 'Confirmar senha', 'new-password')}
                    </div>
                  </div>
  
                  <div className="cadastro-group">
                    <h2 className="cadastro-group-tag">Registro profissional</h2>
                    <div className="cadastro-grid-2">
                      <div className={fieldClass('crm')}>
                        <label htmlFor="cad-crm">
                          CRM<span className="req">*</span>
                        </label>
                        <input
                          id="cad-crm"
                          type="text"
                          inputMode="numeric"
                          placeholder="123456"
                          value={form.crm}
                          onChange={(e) => setField('crm', e.target.value.replace(/\D/g, '').slice(0, CRM_MAX))}
                        />
                        {fieldMsg('crm')}
                      </div>
                      {selectField('uf', 'Estado (UF)', stateOptions)}
                    </div>
                    {selectField('especialidade', 'Especialidade', specialtyOptions)}
                  </div>
  
                  <div className="cadastro-group">
                    <label className={`cadastro-checkbox-field${errors.declaracao ? ' has-error' : ''}`}>
                      <input
                        id="cad-declaracao"
                        type="checkbox"
                        checked={form.declaracao}
                        onChange={(e) => setField('declaracao', e.target.checked)}
                      />
                      <span>
                        Declaro ser um profissional da saúde devidamente registrado e responsável pela veracidade das
                        informações fornecidas.
                      </span>
                    </label>
                    {fieldMsg('declaracao')}
                  </div>
                </>
              )}
  
              {serverError && (
                <div className="cadastro-alert" role="alert">
                  <p>{serverError.message}</p>
                  {serverError.error === 'ja_cadastrado' && (
                    <button type="button" className="cadastro-link" onClick={() => switchMode('entrar')}>
                      Entrar com meu cadastro
                    </button>
                  )}
                </div>
              )}
  
              <button type="submit" className="cadastro-submit" disabled={submitting}>
                {submitting ? 'Aguarde…' : mode === 'entrar' ? 'Entrar' : 'Criar cadastro e acessar'}
              </button>
            </form>
  
            <footer className="cadastro-footer">
              <p>Desenvolvido pela Medscape a pedido da {brand.partner}.</p>
              <p>Conteúdo destinado exclusivamente a profissionais de saúde.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
