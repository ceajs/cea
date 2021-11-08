import sstore from '@beetcb/sstore'
import type { SignaleOptions } from 'signale'
import type { LogRouter } from '../types/logger'

import signale from 'signale'
import { notify, saveNotifications } from './notifier.js'
const isNotificationEnabled = sstore.get('notifier')?.length
const { Signale } = signale

// Will be cached by node
const log: LogRouter = {
  ...new Signale({
    types: {
      error: {
        label: '失败',
      },
      success: {
        label: '成功',
      },
      warn: {
        label: '警示',
      },
    },
  } as SignaleOptions),
  notify,
}

const logProxiedRouter = new Proxy(
  log as typeof log & {
    notify: () => Promise<void>
    object: (obj: { [K: string]: string }) => void
  },
  {
    get(target, prop, receiver) {
      if (prop === 'error' || prop === 'success' || prop === 'warn') {
        if (isNotificationEnabled) {
          return (...args: any[]) => {
            saveNotifications(args)
            target[prop].apply(target, args)
          }
        }
      }
      return Reflect.get(target, prop, receiver)
    },
  },
)

export default logProxiedRouter
