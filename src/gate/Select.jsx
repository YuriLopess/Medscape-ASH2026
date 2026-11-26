import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Select.css';

/*
  Lista suspensa com busca (UF, especialidade). O painel abre num portal em document.body,
  posicionado contra a viewport, pra não ser cortado pelo cartão do formulário.
  options: [{ value, label }]
*/

const ESTIMATED_PANEL_HEIGHT = 284;

function normalize(s) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export default function Select({ id, value, onChange, options, placeholder, hasError }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return options;
    return options.filter((o) => normalize(o.label).includes(q));
  }, [options, query]);

  const listboxId = `${id}-listbox`;
  const optionId = (i) => `${id}-option-${i}`;

  const measure = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openAbove = spaceBelow < ESTIMATED_PANEL_HEIGHT && r.top > spaceBelow;
    setRect(
      openAbove
        ? { bottom: window.innerHeight - r.top + 6, left: r.left, width: r.width }
        : { top: r.bottom + 6, left: r.left, width: r.width }
    );
  };

  const openPanel = () => {
    setQuery('');
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    measure();
    setOpen(true);
  };

  const close = (returnFocus) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const commit = (opt) => {
    onChange(opt.value);
    close(true);
  };

  useLayoutEffect(() => {
    if (open) measure();
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return undefined;
    const onClickOutside = (e) => {
      if (rootRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onResize = () => measure();
    // O painel é posicionado contra a viewport, então um scroll da página o desgrudaria do
    // gatilho. Rolar a própria lista de opções não deve fechar o painel.
    const onScroll = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  const onTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPanel();
    }
  };

  const onSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIndex]) commit(filtered[activeIndex]);
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  return (
    <div className={`cs-select${open ? ' is-open' : ''}${hasError ? ' has-error' : ''}`} ref={rootRef}>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className="cs-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? close(false) : openPanel())}
        onKeyDown={onTriggerKeyDown}
      >
        <span className={selected ? undefined : 'cs-select-placeholder'}>{selected ? selected.label : placeholder}</span>
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={panelRef}
            className="cs-select-panel"
            style={{ top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width }}
          >
            <input
              ref={searchRef}
              type="text"
              className="cs-select-search"
              placeholder="Buscar…"
              value={query}
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-activedescendant={filtered[activeIndex] ? optionId(activeIndex) : undefined}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onSearchKeyDown}
            />
            <ul className="cs-select-list" role="listbox" id={listboxId} ref={listRef} aria-label={placeholder}>
              {filtered.length === 0 && <li className="cs-select-empty">Nenhum resultado</li>}
              {filtered.map((opt, i) => (
                <li
                  key={opt.value}
                  id={optionId(i)}
                  role="option"
                  aria-selected={opt.value === value}
                  className={`cs-select-option${i === activeIndex ? ' is-active' : ''}${opt.value === value ? ' is-selected' : ''}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(opt)}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
