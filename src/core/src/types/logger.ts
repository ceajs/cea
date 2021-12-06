import type { Signale } from 'signale'

export interface LogRouter extends Signale {
  notify: (msg: string) => Promise<void>
}
