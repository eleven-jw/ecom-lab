import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export const startMockWorker = async () => {
  if (typeof window === 'undefined') {
    return
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
