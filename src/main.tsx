import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import './index.css'
import App from './App.tsx'
import { store } from './store'

const ENABLE_MSW =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false'

async function enableMocking() {
  if (!ENABLE_MSW) {
    return
  }

  const { startMockWorker } = await import('./mocks/browser')
  await startMockWorker()
}

async function bootstrap() {
  await enableMocking()

  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </StrictMode>,
  )
}

void bootstrap()
