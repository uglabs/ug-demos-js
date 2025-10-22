import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ToastProvider } from './components/Toast/ToastProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
)
