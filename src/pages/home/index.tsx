import { useEffect } from 'react'
import { Layout, Row, Col, Typography } from 'antd'
import BlogAvatar from '../../components/body/home/avatar'
import homeStyle from './index.module.css'
import { useAppSelector } from '../../redux/hooks'
import { I18N } from '../../config/constant'
const { Title, Paragraph, Text, Link } = Typography

const HomeCompo = () => {
    const selectedLanguage = useAppSelector((state) => state.language.value)

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    return (
        <Layout style={{ padding: '0em 0.5em' }} lang={selectedLanguage}>
            <Row>
                <Col
                    xs={{ offset: 0 }}
                    sm={{ offset: 2 }}
                    md={{ offset: 2 }}
                    lg={{ offset: 2 }}
                    xl={{ offset: 4 }}
                >
                    <BlogAvatar></BlogAvatar>
                    {selectedLanguage === I18N['zh'].key ?
                        <Typography>
                            <Title style={{ marginTop: '0.5em' }}>Hi.</Title>
                            <Title level={3} style={{ marginTop: '0.5em', marginBottom: '0.7em' }}>我是 Zhulintao.</Title>
                            <Paragraph>
                                <p className={homeStyle.homeText}>我在东京工作，是一名Web程序员。</p>
                                <p className={homeStyle.homeText}>我热爱编程并想成为一名全栈工程师。</p>
                                <p className={homeStyle.homeText}>我主要使用 Javascript (
                                    <Text underline><Link href='https://cn.vuejs.org/' target="_blank">Vue</Link></Text>,&nbsp;
                                    <Text underline><Link href='https://zh-hans.reactjs.org/' target="_blank">React</Link></Text>
                                    ) 和 Java (
                                    <Text underline><Link href='https://spring.io/' target="_blank">Spring</Link></Text>
                                    )语言。</p>
                                <p className={homeStyle.homeText}>如果你碰巧也是一名程序员或开发者，欢迎关注我的&nbsp;
                                    <Text underline><Link href='https://github.com/shurintou' target="_blank">Github</Link></Text>
                                    。</p>
                                <p className={homeStyle.homeText}>作为闲暇时的业余爱好，我喜欢唱歌、钻研各种美食和打羽毛球。</p>
                            </Paragraph>
                        </Typography>
                        : selectedLanguage === I18N['ja'].key ?
                            <Typography>
                                <Title style={{ marginTop: '0.5em' }}>こんにちは</Title>
                                <Title level={3} style={{ marginTop: '0.5em', marginBottom: '0.7em' }}>しゅ りんとうと申します。</Title>
                                <Paragraph>
                                    <p className={homeStyle.homeText}>私は東京で働くWeb開発者です。</p>
                                    <p className={homeStyle.homeText}>コーディングが好きで、フルスタックエンジニアになりたいです。</p>
                                    <p className={homeStyle.homeText}>言語は、主に Javascript (
                                        <Text underline><Link href='https://vuejs.org/' target="_blank">Vue</Link></Text>,&nbsp;
                                        <Text underline><Link href='https://ja.reactjs.org/' target="_blank">React</Link></Text>
                                        ) と Java (
                                        <Text underline><Link href='https://spring.io/' target="_blank">Spring</Link></Text>
                                        )を使っています。</p>
                                    <p className={homeStyle.homeText}>もしGithubアカウントをお持ちでしたら、
                                        <Text underline><Link href='https://github.com/shurintou' target="_blank">フォロー</Link></Text>
                                        をお願いいたします。</p>
                                    <p className={homeStyle.homeText}>ちなみに、私の趣味は、カラオケ、料理を作ること、及びバドミントンです。</p>
                                </Paragraph>
                            </Typography>
                            :
                            <Typography>
                                <Title style={{ marginTop: '0.5em' }}>Hello.</Title>
                                <Title level={3} style={{ marginTop: '0.5em', marginBottom: '0.7em' }}>My name is Shurintou.</Title>
                                <Paragraph>
                                    <p className={homeStyle.homeText}>I'm a Web Developer working in Tokyo.</p>
                                    <p className={homeStyle.homeText}>I love coding and want to become a Full Stack Engineer.</p>
                                    <p className={homeStyle.homeText}>I mainly write program in Javascript (
                                        <Text underline><Link href='https://vuejs.org/' target="_blank">Vue</Link></Text>,&nbsp;
                                        <Text underline><Link href='https://reactjs.org/' target="_blank">React</Link></Text>
                                        ) and Java (
                                        <Text underline><Link href='https://spring.io/' target="_blank">Spring</Link></Text>
                                        ).</p>
                                    <p className={homeStyle.homeText}>If you happen to be a programmer, you can follow me on my&nbsp;
                                        <Text underline><Link href='https://github.com/shurintou' target="_blank">Github</Link></Text>
                                        .</p>
                                    <p className={homeStyle.homeText}>In my spare time, I enjoy karaoke, cooking food and playing badminton.</p>
                                </Paragraph>
                            </Typography>
                    }
                </Col>
            </Row>
        </Layout>
    )
}

const HomeModule = () => <HomeCompo />
export default HomeModule
