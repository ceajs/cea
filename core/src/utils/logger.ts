import { Signale, SignaleOptions } from 'signale'

export default new Signale({
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
} as SignaleOptions)
