import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

/*
  PDF da transcrição, gerado no navegador (nada é enviado a servidor algum). Fontes padrão do PDF: Helvetica, que cobre os
  acentos do português, e Symbol para o que falta nela (letras gregas, como β e κ, e sinais como ≥). Um caractere que
  nenhuma das duas tenha sai como "?": nunca some em silêncio, porque isso poderia mudar o sentido do texto médico.
*/
const PAGE = [595.28, 841.89]; // A4
const MARGIN = 56;
const WIDTH = PAGE[0] - MARGIN * 2;
const BLUE = rgb(5 / 255, 74 / 255, 167 / 255);
const TEXT = rgb(0.2, 0.2, 0.2);
const MUTED = rgb(0.4, 0.4, 0.4);
const LEGAL_SIZE = 7;

// Espaços especiais viram espaço comum; hífen opcional sai; hífen que não quebra vira hífen
const tidy = (s) => s.normalize('NFC').replace(/[\s   ]+/g, ' ').replace(/­/g, '').replace(/‑/g, '-').trim();

export async function buildTranscriptPdf({ title, kicker, notice, legal, paragraphs }) {
  const doc = await PDFDocument.create();
  doc.setTitle(title);
  doc.setSubject(kicker);
  doc.setAuthor('Medscape');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const symbol = await doc.embedFont(StandardFonts.Symbol);
  const inText = new Set(regular.getCharacterSet());
  const inSymbol = new Set(symbol.getCharacterSet());

  // Cada caractere com a fonte que o tem. Sem equivalente direto, tenta a forma simples (⁺ → +); senão, "?"
  const glyphs = (text, font) => [...text].flatMap((c) => {
    const pick = (ch) => (inText.has(ch.codePointAt(0)) ? { c: ch, font } : inSymbol.has(ch.codePointAt(0)) ? { c: ch, font: symbol } : null);
    return pick(c) ?? [...c.normalize('NFKC')].map((ch) => pick(ch) ?? { c: '?', font });
  });

  // Largura somada letra a letra: a medida da biblioteca desconta o kerning, que o texto desenhado não tem
  const widths = new Map();
  const charWidth = ({ c, font }) => {
    const key = font.name + c;
    if (!widths.has(key)) widths.set(key, font.widthOfTextAtSize(c, 1));
    return widths.get(key);
  };
  const textWidth = (text, font, size) => glyphs(text, font).reduce((w, g) => w + charWidth(g), 0) * size;

  // Desenha a linha em trechos, um por fonte
  function drawLine(pg, text, { x, y, size, font, color }) {
    const runs = [];
    for (const g of glyphs(text, font)) {
      const last = runs.at(-1);
      if (last?.font === g.font) { last.text += g.c; last.width += charWidth(g); } else runs.push({ font: g.font, text: g.c, width: charWidth(g) });
    }
    let cx = x;
    for (const r of runs) {
      pg.drawText(r.text, { x: cx, y, size, font: r.font, color });
      cx += r.width * size;
    }
  }

  function wrap(text, font, size, width = WIDTH) {
    const lines = [];
    let line = '';
    for (const word of tidy(text).split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (line && textWidth(next, font, size) > width) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  // O aviso legal sai no pé de todas as páginas: a altura dele define onde o texto termina
  const legalLines = wrap(legal, regular, LEGAL_SIZE);
  const bottom = MARGIN + legalLines.length * 9 + 22;

  let page;
  let y;
  const addPage = () => {
    page = doc.addPage(PAGE);
    y = PAGE[1] - MARGIN;
  };
  const write = (lines, font, size, leading, color) => {
    for (const line of lines) {
      if (y - size < bottom) addPage();
      drawLine(page, line, { x: MARGIN, y: y - size, size, font, color });
      y -= leading;
    }
  };

  addPage();
  write(wrap(notice, regular, 9), regular, 9, 13, MUTED);
  y -= 14;
  write(wrap(kicker, bold, 9), bold, 9, 14, BLUE);
  y -= 4;
  write(wrap(title, bold, 20), bold, 20, 25, BLUE);
  y -= 8;
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE[0] - MARGIN, y }, thickness: 1, color: BLUE });
  y -= 18;

  for (const p of paragraphs) {
    if (p.speaker) {
      // O nome nunca fica sozinho no fim da página
      if (y - 48 < bottom) addPage();
      y -= 4;
      write(wrap(p.speaker, bold, 10.5), bold, 10.5, 16, BLUE);
    }
    write(wrap(p.text ?? p, regular, 10.5), regular, 10.5, 16, TEXT);
    y -= 8;
  }

  const pages = doc.getPages();
  pages.forEach((pg, n) => {
    let ly = MARGIN + legalLines.length * 9 - 4;
    pg.drawLine({ start: { x: MARGIN, y: ly + 12 }, end: { x: PAGE[0] - MARGIN, y: ly + 12 }, thickness: 0.5, color: MUTED });
    for (const line of legalLines) {
      drawLine(pg, line, { x: MARGIN, y: ly, size: LEGAL_SIZE, font: regular, color: MUTED });
      ly -= 9;
    }
    const label = `${n + 1} / ${pages.length}`;
    pg.drawText(label, { x: PAGE[0] - MARGIN - regular.widthOfTextAtSize(label, 8), y: MARGIN - 20, size: 8, font: regular, color: MUTED });
  });

  return doc.save();
}

export async function downloadTranscript({ fileName, ...content }) {
  const bytes = await buildTranscriptPdf(content);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
  document.body.append(a);
  a.click();
  a.remove();
  // Dá tempo de o navegador começar o download antes de liberar a memória
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
