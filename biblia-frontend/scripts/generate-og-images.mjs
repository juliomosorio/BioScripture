// Genera una imagen de "vista previa" (og:image) por personaje, para que al
// compartir el link por WhatsApp/redes se vea una tarjeta bonita en vez de
// nada. Se corre a mano (no en cada visita) porque los renderers de imagen
// (satori + resvg-wasm) no empaquetan bien dentro del build de Nitro/Vercel.
//
// Uso:
//   node scripts/generate-og-images.mjs                       # apunta a http://localhost:8000
//   node scripts/generate-og-images.mjs https://tu-backend.com # apunta a producción
//
// Vuelve a correrlo cada vez que agregues o edites personajes.

import satori from 'satori'
import { Resvg, initWasm } from '@resvg/resvg-wasm'
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'og')
const apiBase = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '')

function h(type, props = {}, ...children) {
  const flat = children.flat().filter((c) => c !== null && c !== undefined && c !== false)
  return { type, props: { ...props, children: flat.length === 1 ? flat[0] : flat } }
}

async function loadGoogleFont(family, text, weight) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/)
  if (match) {
    const res = await fetch(match[1])
    if (res.status === 200) return await res.arrayBuffer()
  }
  throw new Error(`No se pudo cargar la fuente ${family}`)
}

function buildElement(character) {
  const name = character?.name || 'BioScripture'
  const era = character?.era || 'Historia Sagrada'
  const role = character?.roles?.[0] || ''
  const verse = character?.key_verses?.[0]
  const verseText = verse?.text
    ? (verse.text.length > 150 ? verse.text.slice(0, 150).trimEnd() + '…' : verse.text)
    : null
  const nameSize = name.length > 14 ? 58 : 76

  const element = h(
    'div',
    { style: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF6EE', padding: '70px', fontFamily: 'Inter' } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
      h('div', { style: { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', backgroundColor: '#146B63', backgroundImage: 'linear-gradient(135deg, #146B63, #0B3E3D)' } }, '📖'),
      h('div', { style: { display: 'flex', fontSize: '30px', fontWeight: 700, color: '#241C15' } },
        h('span', {}, 'Bio'),
        h('span', { style: { color: '#146B63' } }, 'Scripture')
      )
    ),
    h('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', marginTop: '20px' } },
      h('div', { style: { display: 'flex', fontSize: '22px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#146B63', marginBottom: '14px' } }, era),
      h('div', { style: { display: 'flex', fontFamily: 'Source Serif 4', fontSize: `${nameSize}px`, fontWeight: 700, color: '#241C15', lineHeight: 1.05, marginBottom: role ? '14px' : '30px' } }, name),
      role ? h('div', { style: { display: 'flex', fontSize: '28px', color: '#4B443C', marginBottom: '34px' } }, role) : null,
      verseText
        ? h('div', { style: { display: 'flex', flexDirection: 'column', borderLeft: '6px solid #C89B3C', paddingLeft: '26px', maxWidth: '920px' } },
            h('div', { style: { display: 'flex', fontSize: '26px', fontStyle: 'italic', color: '#4B443C', lineHeight: 1.45 } }, `"${verseText}"`),
            h('div', { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: '#8F6624', marginTop: '12px' } }, `— ${verse.reference}`)
          )
        : null
    )
  )

  const baseText = [name, era, role, verseText, verse?.reference, 'BioScripture'].filter(Boolean).join(' ')
  // Incluye mayúsculas (por el text-transform: uppercase de "era") y las
  // comillas tipográficas que agrega la plantilla, para que Google Fonts
  // incluya esos glifos en el subset (si no, salen como "tofu" vacío).
  const allText = `${baseText} ${baseText.toUpperCase()} "" — `
  return { element, allText }
}

async function main() {
  mkdirSync(outDir, { recursive: true })

  const wasmPath = require.resolve('@resvg/resvg-wasm/index_bg.wasm')
  await initWasm(readFileSync(wasmPath))

  console.log(`Obteniendo personajes desde ${apiBase} ...`)
  const characters = await (await fetch(`${apiBase}/characters/?limit=200`)).json()
  console.log(`Generando ${characters.length} imágenes...`)

  for (const character of characters) {
    const { element, allText } = buildElement(character)

    const [serifBold, sansRegular, sansBold] = await Promise.all([
      loadGoogleFont('Source Serif 4', allText, 700),
      loadGoogleFont('Inter', allText, 500),
      loadGoogleFont('Inter', allText, 700),
    ])

    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Source Serif 4', data: serifBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: sansRegular, weight: 500, style: 'normal' },
        { name: 'Inter', data: sansBold, weight: 700, style: 'normal' },
      ],
    })

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    const png = resvg.render().asPng()
    writeFileSync(join(outDir, `${character.id}.png`), png)
    console.log(`  ✓ ${character.id}.png`)
  }

  console.log('Listo.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
