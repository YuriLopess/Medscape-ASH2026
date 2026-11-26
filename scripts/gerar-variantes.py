"""
Gera versões menores das fotos de public/images (480, 720, 960 e 1280 px de largura) e a lista em
src/data/image-variants.json, que o componente Media usa para montar o srcset. Cada tamanho (e o
original) também sai em WebP, bem mais leve que o JPEG: o site serve o WebP e deixa o JPEG de reserva.

O navegador passa a baixar a versão do tamanho em que a foto aparece (um card de 290 px não
precisa de uma foto de 1600 px). Rode de novo sempre que adicionar ou trocar uma foto:

    python scripts/gerar-variantes.py

Precisa do Pillow (pip install pillow). Fotos sem versões continuam funcionando: o site só usa
as versões menores das imagens que estão na lista.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
IMAGES = PUBLIC / 'images'
MANIFEST = ROOT / 'src' / 'data' / 'image-variants.json'
WIDTHS = (480, 720, 960, 1280)
QUALITY = 85  # abaixo disso o JPEG começa a mostrar perda nas fotos grandes
WEBP_QUALITY = 78  # WebP nessa qualidade fica visualmente igual ao JPEG 85, com bem menos peso
# Banner da Home: é a maior imagem do site, então sai com menos compressão
HIGH_QUALITY = {'hero'}
SKIP_DIRS = {'logos', 'comite', 'especialistas'}  # logos e fotos de rosto: pequenas, aparecem em tamanho fixo


def is_variant(path: Path) -> bool:
    return any(path.stem.endswith(f'-{w}') for w in WIDTHS)


manifest = {}
for src in sorted(IMAGES.rglob('*.jpg')):
    if is_variant(src) or SKIP_DIRS & set(src.relative_to(IMAGES).parts):
        continue
    with Image.open(src) as im:
        im = im.convert('RGB')
        widths = []
        jpg_q, webp_q = (93, 92) if src.stem in HIGH_QUALITY else (QUALITY, WEBP_QUALITY)
        for w in WIDTHS:
            if im.width <= w:
                continue
            out = src.with_name(f'{src.stem}-{w}{src.suffix}')
            h = round(im.height * w / im.width)
            small = im.resize((w, h), Image.LANCZOS)
            small.save(out, quality=jpg_q, optimize=True, progressive=True)
            small.save(out.with_suffix('.webp'), quality=webp_q, method=6)
            widths.append(w)
        im.save(src.with_suffix('.webp'), quality=webp_q, method=6)
        widths.append(im.width)  # o original entra como a maior opção
    key = src.relative_to(PUBLIC).as_posix()
    manifest[key] = widths
    print(f'{key}: {widths}')

# Artes com transparência (ex.: a arte da cidade no topo das notícias) só existem em WebP: as versões
# menores saem em WebP, mantendo a transparência. O original não é recodificado.
for src in sorted(IMAGES.rglob('*.webp')):
    if is_variant(src) or src.with_suffix('.jpg').exists() or SKIP_DIRS & set(src.relative_to(IMAGES).parts):
        continue
    with Image.open(src) as im:
        widths = []
        for w in WIDTHS:
            if im.width <= w * 1.1:  # quase do tamanho do original: não compensa uma versão à parte
                continue
            small = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            small.save(src.with_name(f'{src.stem}-{w}.webp'), quality=85, alpha_quality=90, method=6)
            widths.append(w)
        widths.append(im.width)
    key = src.relative_to(PUBLIC).as_posix()
    manifest[key] = widths
    print(f'{key}: {widths}')

MANIFEST.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(f'\n{len(manifest)} imagens na lista: {MANIFEST.relative_to(ROOT)}')
