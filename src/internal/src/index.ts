export { attendanceCheckIn } from '@ceajs/attendance-plugin'
export { checkIn } from '@ceajs/sign-plugin'
import { sstore } from '@ceajs/core'
import { confSet } from './conf-set.js'
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
