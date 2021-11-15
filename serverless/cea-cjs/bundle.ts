import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const esmPkgs = ['cea-core', 'cea-check-in', 'app-path', 'terminal-image']

const getPkgPath = (l: string) =>
  path.join(
    `${url.fileURLToPath(import.meta.url)}`,
    '..',
    '..',
    '..',
    `${l}/package.json`,
  )

const ceaCoreDeps = JSON.parse(
  fs.readFileSync(getPkgPath('core'), { encoding: 'utf8' }),
)?.dependencies
const ceaCLIDeps = JSON.parse(
  fs.readFileSync(getPkgPath('internal'), { encoding: 'utf8' }),
)?.dependencies
const ceaPluginCheckIn = JSON.parse(
  fs.readFileSync(getPkgPath('plugins/check-in'), { encoding: 'utf8' }),
)?.dependencies

const externalDeps = [
  ...Object.keys(ceaCoreDeps),
  ...Object.keys(ceaPluginCheckIn),
  ...Object.keys(ceaCLIDeps),
]?.filter((dep: string) => !esmPkgs.includes(dep))

console.log(externalDeps)

esbuild
  .build({
    entryPoints: ['index.ts'],
    bundle: true,
    external: externalDeps,
    platform: 'node',
    target: 'node11',
    outfile: 'lib/src/index.js',
    minify: true,
  })
  .then(console.log)
