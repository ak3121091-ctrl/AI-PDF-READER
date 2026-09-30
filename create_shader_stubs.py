import os

dirs = [
    'src/shaders/sylva-living-world/sources',
    'src/shaders/tidecrest-hero',
    'src/shaders/meridian-landing-page',
    'src/shaders/ascii-field',
    'src/shaders/betawise-globe',
    'src/shaders/axonis-field',
    'src/shaders/nocturne-hero',
]
for d in dirs:
    os.makedirs(d, exist_ok=True)

files = {
    'src/shaders/sylva-living-world/sources/inner-green-3d.html': '',
    'src/shaders/tidecrest-hero/tidecrestDocument.js': 'export function buildTidecrestDocument() { return ""; }',
    'src/shaders/meridian-landing-page/meridianDocument.js': 'export function buildMeridianDocument() { return ""; }',
    'src/shaders/ascii-field/asciiFieldDocuments.js': 'export function buildAsciiFieldDocument() { return ""; }',
    'src/shaders/betawise-globe/betawiseGlobeDocument.js': 'export function buildBetawiseGlobeDocument() { return ""; }',
    'src/shaders/axonis-field/axonis-arbor.html': '',
    'src/shaders/axonis-field/axonis-vortex.html': '',
    'src/shaders/axonis-field/axonis-tide.html': '',
    'src/shaders/axonis-field/axonis-dune.html': '',
    'src/shaders/nocturne-hero/NocturneScene.ts': '''
export const NOCTURNE_TITLES: Record<string, string> = {};
export const NOCTURNE_VARIANTS = ["midnight", "twilight"] as const;
export type NocturneVariant = "midnight" | "twilight";
export function buildNocturneDocument() { return ""; }
''',
    'src/shaders/landing-pages/sandboxedPageDocument.ts': '''
export function buildSandboxedPageDocument(source: string, options?: any) { return source; }
''',
    'src/shaders/sylva-living-world/SylvaLivingWorldScene.ts': '''
export const MAPLE_AUTUMN_STYLE = "";
export const SAKURA_SUNSET_STYLE = "";
export const SEQUOIA_MIST_STYLE = "";
export function applyMapleAutumnVariant(s: string) { return s; }
export function applySakuraSunsetVariant(s: string) { return s; }
export function applySequoiaMistVariant(s: string) { return s; }
'''
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print('Created stub:', path)
