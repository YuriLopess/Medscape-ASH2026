import PartnerLogo from './PartnerLogo.jsx';
import { useContent } from '../i18n.jsx';

// Rodapé: "Desenvolvido por" Medscape e "A pedido da" AstraZeneca, cada marca no seu bloco com o próprio rótulo e um
// fio entre elas (regra Medscape: o logo dela nunca fica colado ao de uma empresa farmacêutica); depois o aviso de
// público, o aviso obrigatório (D) e a Política de Privacidade (E), como pedem as diretrizes Medscape.
export default function SiteFooter() {
  const { disclosure, footer, partner, ui } = useContent();

  return (
    <footer data-draw className="site-footer">
      <div className="container">
        <div className="footer-brands">
          <div className="footer-brand">
            <span className="footer-label">{footer.developedBy}</span>
            <a href="#/" className="footer-medscape" aria-label={ui.homeMedscape}>
              <img src="images/logos/medscape.png?v=2" alt="" width="698" height="160" />
            </a>
          </div>
          <span className="footer-logos-sep" aria-hidden="true" />
          <div className="footer-brand">
            <span className="footer-label">{footer.requestedBy}</span>
            <a href="#/" className="footer-partner" aria-label={ui.homePartner(partner.name)}>
              <PartnerLogo />
            </a>
          </div>
        </div>

        <div className="footer-center">
          <p className="footer-audience">{footer.audience}</p>

          {/* D: aviso de "Cobertura de Conferência", obrigatório no rodapé de todas as páginas */}
          <p className="footer-legal">{disclosure.footer}</p>

          {/* E: link para a Política de Privacidade da Medscape */}
          <a className="footer-privacy" href={footer.privacy.href} target="_blank" rel="noopener noreferrer">
            {footer.privacy.label}
            <span className="sr-only"> {footer.newTab}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
