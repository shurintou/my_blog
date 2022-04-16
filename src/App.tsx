import { Layout } from 'antd';
import BlogHeader from './components/header';
import BlogBody from './components/body';
import BlogFooter from './components/footer';
import './App.less';

function App() {
    return (
        <Layout>
            <BlogHeader />
            <BlogBody />
            <BlogFooter />
        </Layout>
    );
}

export default App;
