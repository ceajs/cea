import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { nodeProtocolPlugin } from './esbuild/legacy-cjs-plugins'

const esmPkgs = [
  '@ceajs/core',
  '@ceajs/check-in-helper',
  '@ceajs/attendance-plugin',
  '@ceajs/sign-plugin',
  '@ceajs/slider-captcha',
  'app-path',
  'terminal-image',
]

const getPkgPath = (l: string) =>
  path.join(
    `${url.fileURLToPath(import.meta.url)}`,
    '..',
    '..',
    '..',
    'src',
    `${l}/package.json`
  )
const ceaCLIPkg = JSON.parse(
  fs.readFileSync(getPkgPath('internal'), { encoding: 'utf8' })
)

const ceaCoreDeps = JSON.parse(
  fs.readFileSync(getPkgPath('core'), { encoding: 'utf8' })
)?.dependencies
const ceaCLIDeps = ceaCLIPkg?.dependencies
const ceaCheckIn = JSON.parse(
  fs.readFileSync(getPkgPath('plugins/check-in-helper'), { encoding: 'utf8' })
)?.dependencies
const ceaSignPlugin = JSON.parse(
  fs.readFileSync(getPkgPath('plugins/sign'), { encoding: 'utf8' })
)?.dependencies

const ceaAttendancePlugin = JSON.parse(
  fs.readFileSync(getPkgPath('plugins/attendance'), { encoding: 'utf8' })
)?.dependencies

const externalDeps = [
  ...Object.entries(ceaCoreDeps),
  ...Object.entries(ceaCheckIn),
  ...Object.entries(ceaSignPlugin),
  ...Object.entries(ceaAttendancePlugin),
  ...Object.entries(ceaCLIDeps),
]?.filter(([depName]: [string, string]) => !esmPkgs.includes(depName))

externalDeps.push(['sharp', '^0.29.3'])

esbuild
  .build({
    entryPoints: ['index.ts'],
    bundle: true,
    external: externalDeps.map(([depName]: [string, string]) => depName),
    platform: 'node',
    target: 'node11',
    outfile: 'lib/src/index.js',
    inject: ['./esbuild/inject.ts'],
    define: {
      'import.meta.url': 'importMetaURL',
    },
    plugins: [nodeProtocolPlugin],
  })
  .then(console.log)

const curPackageJSON = JSON.parse(
  fs.readFileSync('./package.json', { encoding: 'utf8' })
)
for (const dep of externalDeps) {
  const [depName, depValue] = dep
  if (!curPackageJSON.dependencies) {
    curPackageJSON.dependencies = {}
  }
  curPackageJSON.dependencies[depName] = depValue
}

// Record cea version in cea@cjs description
curPackageJSON.description = `Patching cea@${ceaCLIPkg.version} with legacy node(<12.20.0) support`

fs.writeFileSync('./package.json', JSON.stringify(curPackageJSON, null, 2))

console.log({ needsToBeBundled: esmPkgs, externalDeps })
