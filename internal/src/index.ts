import { sstore } from 'cea-core'
import { confSet } from './conf-set.js'
export { checkIn } from 'cea-check-in'
export default class Cea {
  private plugins: Set<() => Promise<void>> = new Set()

  addPlugin(plugin: () => Promise<void>) {
    this.plugins.add(plugin)
  }

  async start() {
    await confSet()
    for (const plugin of this.plugins) {
      await plugin()
    }
    sstore.close()
  }
}
