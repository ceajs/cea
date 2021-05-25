import { sstore } from 'cea-core'
export { checkIn } from 'cea-check-in'

export class Cea {
  private plugins: Set<() => Promise<void>> = new Set()

  addPlugin(plugin: () => Promise<void>) {
    this.plugins.add(plugin)
  }

  async start() {
    for (const plugin of this.plugins) {
      await plugin()
    }
    sstore.close()
  }
}
