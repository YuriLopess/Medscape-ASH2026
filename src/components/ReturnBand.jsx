import { ArrowLeft } from './Icons.jsx';
import { useContent } from '../i18n.jsx';

// Botão que fecha a página de conteúdo devolvendo aos Destaques da cobertura, sem depender do Voltar do navegador.
export default function ReturnBand() {
  const { page } = useContent();
  return (
    <div className="container cp-return">
      <a className="btn btn--outline" href="#destaques">
        <ArrowLeft /> {page.back}
      </a>
    </div>
  );
}
