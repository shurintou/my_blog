import ReactDOMClient from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import { BrowserRouter } from "react-router-dom"

const root = ReactDOMClient.createRoot(document.getElementById('root')!)
root.render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>
)

