import ReactDOMClient from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import { BrowserRouter } from "react-router-dom"
import store from './redux/store'
import { Provider } from 'react-redux'

const root = ReactDOMClient.createRoot(document.getElementById('root')!)
root.render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
)

