import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/montserrat';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import CadastroPage from './CadastroPage.jsx';

// Servidor: depois de entrar, recarregar a mesma URL faz o index.php servir o app — com o mesmo
// #/rota e ?lang=, então um link direto pra um conteúdo volta pra ele depois do login.
// `npm run dev` não tem PHP na frente das páginas: abre o home.html direto.
const enter = import.meta.env.DEV
  ? () => window.location.assign(`/home.html${window.location.search}${window.location.hash}`)
  : () => window.location.reload();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CadastroPage onEnter={enter} />
  </StrictMode>
);
