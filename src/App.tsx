import { Layout } from 'antd'
import BlogHeader from './components/header'
import BlogBody from './components/body'
import BlogFooter from './components/footer'
import { getLocalHtmlLang } from './utils/userAgent'
import './App.less'

function App() {
    document.querySelector('html')?.setAttribute('lang', getLocalHtmlLang())
    return (
        <Layout>
            <BlogHeader />
            <BlogBody />
            <BlogFooter />
        </Layout>
    )
}

export default App
