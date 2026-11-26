import { useState } from 'react';
import { Download, User } from './Icons.jsx';
import { useContent } from '../i18n.jsx';
import { initials } from '../lib/initials.js';
import { track } from '../analytics.js';

// Baixa a transcrição: o PDF aprovado (transcriptPdf), se houver; senão, um gerado na hora a partir do texto.
function DownloadPdf({ item }) {
  const { disclosure, event, page } = useContent();
  const [state, setState] = useState('idle'); // idle | busy | error

  if (!item.transcript && !item.transcriptPdf) return <p className="tr-note">{page.downloadSoon}</p>;

  const onTrack = () => track('download_transcript', { slug: item.slug ?? item.topic });
  if (item.transcriptPdf) {
    return (
      <a className="btn btn--dark" href={item.transcriptPdf} download onClick={onTrack}><Download /> {page.downloadPdf}</a>
    );
  }

  async function generate() {
    setState('busy');
    try {
      // O gerador de PDF só é baixado quando alguém pede o arquivo
      const { downloadTranscript } = await import('../lib/transcriptPdf.js');
      await downloadTranscript({
        fileName: `${item.id}-${event.name}`,
        title: item.title,
        kicker: `${page.transcript} · ${event.name}`,
        notice: disclosure.top,
        legal: disclosure.footer,
        paragraphs: item.transcript,
      });
      onTrack();
      setState('idle');
    } catch (err) {
      console.error(err);
      setState('error');
    }
  }

  return (
    <div className="tr-download">
      <button type="button" className="btn btn--dark" disabled={state === 'busy'} onClick={generate}>
        <Download /> {state === 'busy' ? page.downloadBusy : page.downloadPdf}
      </button>
      {state === 'error' && <p className="tr-note" role="alert">{page.downloadError}</p>}
    </div>
  );
}

// Transcrição na lateral: só o botão do PDF. Sem transcrição ainda, o botão aparece desativado, com o aviso embaixo
export function TranscriptDownload({ item }) {
  const { page } = useContent();
  const ready = Boolean(item.transcript || item.transcriptPdf);
  return (
    <div className="vp-tr">
      <p className="vp-side-title">{page.transcript}</p>
      {ready ? (
        <DownloadPdf item={item} />
      ) : (
        <>
          <button type="button" className="btn btn--dark" disabled><Download /> {page.downloadPdf}</button>
          <p className="tr-note">{page.downloadSoon}</p>
        </>
      )}
    </div>
  );
}

// Especialista: foto, nome, especialidade e cargo, minicurrículo e conflitos declarados
function Speaker({ speaker }) {
  const { page } = useContent();
  return (
    <li className="sk">
      {/* Identificação: foto, nome, especialidade (etiqueta) e cargo/instituição */}
      <div className="sk-head">
        {speaker.photo ? (
          <img className="sk-photo" src={speaker.photo} alt="" width="76" height="76" loading="lazy" />
        ) : (
          <span className={`sk-photo${speaker.placeholder ? ' sk-photo--empty' : ' sk-photo--initials'}`} aria-hidden="true">
            {speaker.placeholder ? <User width="34" height="34" /> : initials(speaker.name)}
          </span>
        )}
        <div className="sk-id">
          <h4 className="sk-name">{speaker.name}</h4>
          {(speaker.specialty || speaker.role) && (
            <p className="sk-role">
              {speaker.specialty && <span className="sk-tag">{speaker.specialty}</span>}
              {speaker.role && <span>{speaker.role}</span>}
            </p>
          )}
        </div>
      </div>
      {/* Minicurrículo e conflitos, cada um com o próprio rótulo */}
      {speaker.bio && (
        <div className="sk-block">
          <p className="sk-label">{page.bio}</p>
          <p>{speaker.bio}</p>
        </div>
      )}
      {speaker.coi && (
        <div className="sk-block">
          <p className="sk-label">{page.coi}</p>
          <p>{speaker.coi}</p>
        </div>
      )}
    </li>
  );
}

/*
  "Sobre o vídeo", logo abaixo do player: introdução, declaração de conflitos de interesse e os especialistas, na
  ordem do texto aprovado.
*/
export function About({ item }) {
  const { event, page, partner } = useContent();
  const sponsor = item.sponsor ?? partner.name;
  // Vídeo ainda não publicado e sem especialistas: mostra o modelo da ficha. Publicado, nunca aparece nome provisório.
  const speakers = item.speakers.length > 0 ? item.speakers : item.upcoming ? [page.placeholderSpeaker] : [];
  return (
    <section className="ab" aria-labelledby="ab-title">
      <h2 id="ab-title" className="vt-title">{page.about}</h2>
      {page.aboutIntro(event.name, sponsor).map((p) => <p key={p}>{p}</p>)}
      <h3 className="ab-title">{page.coiTitle}</h3>
      {page.coiText(sponsor).map((p) => <p key={p}>{p}</p>)}
      {speakers.length > 0 && (
        <>
          <h3 className="ab-title">{page.speakersTitle}</h3>
          <ul className="sk-list">
            {speakers.map((s) => <Speaker key={s.name} speaker={s} />)}
          </ul>
        </>
      )}
    </section>
  );
}
