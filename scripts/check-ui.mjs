// Catches the usual "AI slop" in UI code before it lands.
// Run: npm run check:ui  (exits 1 when something is found)
//
// Checks .vue and .ts files under src/, except legacy Cloudscape code
// (src/components/cs/, src/styles/), which is being removed.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')
const IGNORED = ['src/components/cs/', 'src/styles/', 'src/assets/icons/']

const PALETTE =
  'slate|gray|zinc|neutral|stone|taupe|mauve|mist|olive|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white'

const RULES = [
  {
    name: 'Raw color value',
    hint: 'Use a semantic class (text-muted, bg-elevated, border-default, text-error) or a theme variable.',
    re: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(/g,
  },
  {
    name: 'Tailwind palette color',
    hint: 'Use semantic classes (text-highlighted/default/toned/muted/dimmed, bg-default/muted/elevated, border-default) or color props on Nuxt UI components.',
    re: new RegExp(
      `\\b(?:text|bg|border|ring|outline|fill|stroke|divide|decoration|from|via|to|placeholder|accent|caret)-(?:${PALETTE})(?:-\\d{2,3})?(?:\\/\\d+)?\\b`,
      'g',
    ),
  },
  {
    name: 'Gradient',
    hint: 'No gradients. Flat surfaces only.',
    re: /\bbg-(?:gradient|linear|radial|conic)-|\b(?:linear|radial|conic)-gradient\(/g,
  },
  {
    name: 'Shadow on a surface',
    hint: 'Cards and sections use a 1px border, not a shadow. Floating layers (modal, dropdown, toast) get theirs from Nuxt UI.',
    re: /\bshadow(?:-(?:xs|sm|md|lg|xl|2xl|inner))?\b(?!-)|box-shadow\s*:/g,
  },
  {
    name: 'Blur / glass effect',
    hint: 'No glassmorphism.',
    re: /\bbackdrop-blur\b|\bblur-(?:sm|md|lg|xl|2xl|3xl)\b|backdrop-filter\s*:/g,
  },
  {
    name: 'Emoji',
    hint: 'No emoji in UI. Use a Lucide icon (i-lucide-*) if an icon is needed.',
    re: /\p{Extended_Pictographic}/gu,
  },
  {
    name: 'Icon outside Lucide',
    hint: 'Only i-lucide-* icons.',
    re: /["'\s]i-(?!lucide-)[a-z0-9]+-[a-z0-9-]+["'\s]|from ['"](?:lucide-vue-next|@heroicons\/[^'"]+|@fortawesome\/[^'"]+)['"]/g,
  },
  {
    name: 'Hand-rolled control',
    hint: 'Use UButton, UInput, UModal, … instead of raw elements.',
    re: /<(?:button|input|select|textarea|dialog)\b/g,
  },
]

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return /\.(vue|ts)$/.test(name) && !name.endsWith('.d.ts') ? [path] : []
  })
}

let problems = 0
for (const file of walk(SRC)) {
  const rel = relative(ROOT, file)
  if (IGNORED.some((prefix) => rel.startsWith(prefix))) continue
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (line.includes('check-ui-ignore')) return
    for (const rule of RULES) {
      rule.re.lastIndex = 0
      const match = rule.re.exec(line)
      if (!match) continue
      problems++
      console.log(`${rel}:${i + 1}  ${rule.name}: "${match[0].trim()}"\n    → ${rule.hint}`)
    }
  })
}

if (problems) {
  console.log(`\n${problems} problem(s). Fix them, or add "check-ui-ignore" on the line with a reason.`)
  process.exit(1)
}
console.log('check:ui passed')
