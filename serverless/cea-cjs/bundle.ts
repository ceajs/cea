import esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { nodeProtocolPlugin } from './esbuild/legacy-cjs-plugins'

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
  ...Object.entries(ceaCoreDeps),
  ...Object.entries(ceaPluginCheckIn),
  ...Object.entries(ceaCLIDeps),
]?.filter(([depName]: [string, string]) => !esmPkgs.includes(depName))

console.log(externalDeps)

esbuild
  .build({
    entryPoints: ['index.ts'],
    bundle: true,
    external: externalDeps.map(([depName]: [string, string]) => depName),
    platform: 'node',
    target: 'node11',
    outfile: 'lib/src/index.js',
    minify: true,
    inject: ['./esbuild/inject.ts'],
    define: {
      'import.meta.url': 'importMetaURL',
    },
    plugins: [nodeProtocolPlugin],
  })
  .then(console.log)

const curPackageJSON = JSON.parse(
  fs.readFileSync('./package.json', { encoding: 'utf8' }),
)
for (const dep of externalDeps) {
  const [depName, depValue] = dep
  if (!curPackageJSON.dependencies) {
    curPackageJSON.dependencies = {}
  }
  curPackageJSON.dependencies[depName] = depValue
}

fs.writeFileSync('./package.json', JSON.stringify(curPackageJSON, null, 2))
