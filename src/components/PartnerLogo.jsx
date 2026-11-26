import { useContent } from '../i18n.jsx';

// Logo da empresa que solicita a cobertura; sem arquivo (content.js → partnerLogo), o nome em texto
export default function PartnerLogo({ className }) {
  const { partner } = useContent();
  if (!partner.logo) return <span className="partner-name">{partner.name}</span>;
  return <img className={className} src={partner.logo} alt="" width="720" height="176" />;
}
