# Imagens originais

Arquivos de origem das imagens do site, em alta resolução. Ficam fora de `public/` e não vão para o site publicado:
servem para refazer um recorte ou trocar uma imagem sem perder qualidade.

| Arquivo | Onde aparece | Arquivo no site | Nome original |
|---|---|---|---|
| `hero.webp` | Banner da Home | `public/images/hero.jpg` (com 120 px de céu acrescentados no alto) | Nova Orleans_ Rio de Luz e Sangue |
| `cobertura-arte.webp` | Fundo da abertura das páginas de vídeo e do Pós-ASH | `public/images/cobertura-arte.jpg` | Fluxo Sanguíneo em Ondas Translúcidas |
| `video-1.webp` | Capa do vídeo 1 | `public/images/videos/video-1.jpg` | Microscópio e Lâmina de Células Coradas |
| `video-2.webp` | Capa do vídeo 2 | `public/images/videos/video-2.jpg` | Glóbulos Vermelhos na Corrente Sanguínea |
| `video-3.webp` | Capa do vídeo 3 | `public/images/videos/video-3.jpg` | Células Plasmáticas no Interior da Medula Óssea |
| `video-4.webp` | Capa do vídeo 4 | `public/images/videos/video-4.jpg` | Pipetagem em Placa de Laboratório |
| `pos-ash.webp` | Capa do Pós-ASH | `public/images/videos/pos-ash.jpg` | Conferência Médica com Imagens Microscópicas |

Para trocar uma imagem: salve o JPG final em `public/images/...` com o mesmo nome e rode
`python scripts/gerar-variantes.py` (gera os tamanhos menores e o WebP que o site usa).
