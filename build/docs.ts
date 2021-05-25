const TypeDoc = require('typedoc')
import { readFileSync } from 'fs'

async function main() {
  const tsconfigRaw = readFileSync('tsconfig.json', 'utf8')
  let tsconfig: { references: Array<{ path: string }> }
  if (tsconfigRaw) {
    tsconfig = JSON.parse(tsconfigRaw)
  } else {
    console.error('tsconfig not found!')
    return
  }

  // asynchronizedly build api docs
  for (const { path } of tsconfig.references) {
    const app = new TypeDoc.Application()
    // If you want TypeDoc to load tsconfig.json / typedoc.json files
    app.options.addReader(new TypeDoc.TSConfigReader())
    app.options.addReader(new TypeDoc.TypeDocReader())
    const pkgName = path.slice(1)
    app.bootstrap({
      // typedoc options here
      entryPoints: [`${path}src/index.ts`],
      theme: './node_modules/typedoc-gitlab-wiki-theme/dist',
    })

    const project = app.convert()

    if (project) {
      // Project may not have converted correctly
      const outputDir = `docs/api${pkgName}`
      // Rendered docs
      app.generateDocs(project, outputDir)
    }
  }
}

main().catch(console.error)
