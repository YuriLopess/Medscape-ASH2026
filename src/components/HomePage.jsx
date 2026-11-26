import Hero from './Hero.jsx';
import FeaturedVideos from './FeaturedVideos.jsx';
import Supporters from './Supporters.jsx';

// Home da cobertura: Banner → Destaques da cobertura (4 vídeos: um grande e três menores) → Apoiadores.
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedVideos />
      <Supporters />
    </>
  );
}
