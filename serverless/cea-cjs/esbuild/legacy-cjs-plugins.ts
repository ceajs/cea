import type { OnResolveArgs, Plugin } from 'esbuild'
import path from 'node:path'

/**
 * Resolve `node:*` import to `*` import
 * @example node:crypto => crypto
 */
const nodeProtocolPlugin: Plugin = {
  name: 'node-protocol',
  setup(build) {
    build.onResolve({ filter: /^node:/ }, (args: OnResolveArgs) => ({
      path: path.join(args.path.replace('node:', '')),
      external: true,
    }))
  },
}

export { nodeProtocolPlugin }
