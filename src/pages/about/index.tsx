import React, { useEffect, useState, useRef } from 'react'
import { Layout, Row, Col, Typography, Space, Divider, BackTop, } from 'antd'
import Gitalk from '../../components/common/gitalk'
import config from '../../config/config'
import { debounce, doScrolling } from '../../utils/common'
import aboutStyle from './index.module.css'
import { useAppSelector } from '../../redux/hooks'
import { I18N } from '../../config/constant'

const { Text, Title, Link } = Typography

const AboutCompo: React.FC<{}> = () => {
    const [pcRenderMode, setPcRenderMode] = useState(window.innerWidth >= 992 || document.documentElement.clientWidth >= 992)
    const [loadImg, setLoadImg] = useState([false, false, false, false])
    const [showImgDistance, setShowImgDistance] = useState(-100)
    const [windowInnerHeight, setWindowInnerHeight] = useState(window.innerHeight || document.documentElement.clientHeight)
    const [imageContent1Height, setImageContent1Height] = useState(pcRenderMode ? '35em' : '25em')
    const [textContent1Height, setTextContent1Height] = useState(pcRenderMode ? '35em' : '')
    const [imageContent2Height, setImageContent2Height] = useState(pcRenderMode ? '30em' : '25em')
    const [textContent2Height, setTextContent2Height] = useState(pcRenderMode ? '30em' : '')
    const [content1Padding, setContent1Padding] = useState(pcRenderMode ? '3.75rem 3rem 1.75rem 3rem' : '1em 0.5rem 0rem 0.5rem')
    const [content2Padding, setContent2Padding] = useState(pcRenderMode ? '4.25rem 3rem 1.75rem 4.25rem' : '1em 0.5rem 0rem 0.5rem')

    useEffect(() => {
        setImageContent1Height(pcRenderMode ? '35em' : '25em')
        setTextContent1Height(pcRenderMode ? '35em' : '')
        setImageContent2Height(pcRenderMode ? '30em' : '25em')
        setTextContent2Height(pcRenderMode ? '30em' : '')
        setContent1Padding(pcRenderMode ? '3.75rem 3rem 1.75rem 3rem' : '1em 0.5rem 0rem 0.5rem')
        setContent2Padding(pcRenderMode ? '4.25rem 3rem 1.75rem 4.25rem' : '1em 0.5rem 0rem 0.5rem')
    }, [pcRenderMode])

    const windowResizeFunc = () => {
        const newWindowInnerWidth = window.innerWidth || document.documentElement.clientWidth
        const newWindowInnerHeight = window.innerHeight || document.documentElement.clientHeight
        setShowImgDistance(newWindowInnerWidth >= 992 ? (-newWindowInnerHeight / 4) : (-newWindowInnerHeight / 3))
        setPcRenderMode(newWindowInnerWidth >= 992)
        setWindowInnerHeight(newWindowInnerHeight)
    }


    // useRef to solve the re-render delay issue. 
    const scrolledTopRef = useRef(windowInnerHeight)
    scrolledTopRef.current = windowInnerHeight
    const loadImgRef = useRef(loadImg)
    loadImgRef.current = loadImg
    const imgDivRefs = useRef<Array<HTMLElement | null>>([])
    const windowScrollFunc = () => {
        let newLoadImg: Array<boolean> = [false, false, false, false] // must create a new Array, otherwise it will not re-render because Array is compared by Reference not Value. 
        const oldLoadImg = loadImgRef.current
        for (let i = 0; i < 4; i++) {
            const imgDiv = imgDivRefs.current[i]
            if (imgDiv && !oldLoadImg[i]) {
                newLoadImg.splice(i, 1, scrolledTopRef.current - imgDiv.getBoundingClientRect().top > (showImgDistance))
            }
            else {
                newLoadImg.splice(i, 1, oldLoadImg[i])
            }
        }
        setLoadImg(newLoadImg)
    }

    const windowResizeDebounceFunc = debounce(windowResizeFunc, config.eventProps.resizeDebounceDelay)

    const scrollToGitalk = () => {
        const gitalkEl: Element | null = document.getElementById('gitalk-container')
        if (gitalkEl) {
            doScrolling(gitalkEl, 500)
        }
    }

    useEffect(() => {
        windowResizeFunc()
        windowScrollFunc()
        window.addEventListener('resize', windowResizeDebounceFunc)
        window.addEventListener('scroll', windowScrollFunc)
        return () => {
            window.removeEventListener('resize', windowResizeDebounceFunc)
            window.removeEventListener('scroll', windowScrollFunc)
        }
        /* eslint-disable-next-line */
    }, [])

    const selectedLanguage = useAppSelector((state) => state.language.value)

    return (
        <Layout>
            <Space direction="vertical" size={'large'}>
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12, push: 12 }} xl={{ span: 12, push: 12 }} style={{ height: imageContent1Height }} ref={el => imgDivRefs.current[0] = el}>
                        {loadImg[0] && <div className={aboutStyle['about-1']} style={{ width: '100%', height: '100%' }}></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12, pull: 12 }} xl={{ span: 12, pull: 12 }} style={{ height: textContent1Height }}>
                        <Layout style={{ padding: content1Padding }} lang={selectedLanguage}>
                            {
                                selectedLanguage === I18N['zh'].key ?
                                    <React.Fragment>
                                        <Title level={1}>关于本站</Title>
                                        <p className={aboutStyle.aboutText}>
                                            本网站是我的<Text keyboard>个人博客</Text>，我会在这里定期地记录分享一些编程经验和心得。
                                        </p>
                                        <p className={aboutStyle.aboutText}>
                                            文章内容主要涉足<Text keyboard>Web编程</Text>的各个领域，使用的语言主要是 Java, Javascript 等。
                                        </p>
                                    </React.Fragment>
                                    : selectedLanguage === I18N['ja'].key ?
                                        <React.Fragment>
                                            <Title level={1}>サイトについて</Title>
                                            <p className={aboutStyle.aboutText}>
                                                こちらのサイトは、私が定期的にプログラミングの考えや経験を共有する<Text keyboard>ブログ</Text>です。
                                            </p>
                                            <p className={aboutStyle.aboutText}>
                                                記事のトピックには、主に Java, Javascript などの<Text keyboard>Webプログラミング</Text>分野の内容が含まれます。
                                            </p>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <Title level={1}>About the Site</Title>
                                            <p className={aboutStyle.aboutText}>
                                                This is a <Text keyboard>blog</Text> which I regularly share some thoughts and experiences in my coding life.
                                            </p>
                                            <p className={aboutStyle.aboutText}>
                                                The topic will mostly includes web development languages that address most facets of<Text keyboard>Web Programming</Text>,
                                                such as Java, Javascript and so on.
                                            </p>
                                        </React.Fragment>
                            }
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 10 }} style={{ height: imageContent2Height }} ref={el => imgDivRefs.current[1] = el}>
                        {loadImg[1] && <div className={aboutStyle['about-2']} style={{ width: '100%', height: '100%' }}></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }} xl={{ span: 14 }} style={{ height: textContent2Height }}>
                        <Layout style={{ padding: content2Padding }} lang={selectedLanguage}>
                            {
                                selectedLanguage === I18N['zh'].key ?
                                    <React.Fragment>
                                        <Title level={1}>关于本人</Title>
                                        <p className={aboutStyle.aboutText}>
                                            我来自<Text keyboard>中国</Text>，从2013年开始来日本留学，最终以硕士学位毕业于东京大学并留在日本工作。
                                        </p>
                                        <p className={aboutStyle.aboutText}>
                                            现就职于<Text keyboard>东京</Text>的一家IT公司负责Web开发，工作{new Date().getFullYear() - 2019}年期间参与并成功上线了多个大型项目。
                                        </p>
                                    </React.Fragment>
                                    : selectedLanguage === I18N['ja'].key ?
                                        <React.Fragment>
                                            <Title level={1}>私について</Title>
                                            <p className={aboutStyle.aboutText}>
                                                私は<Text keyboard>中国</Text>出身で、2013年から日本へ留学しに来て、大学院生として東京大学を卒業しました。
                                            </p>
                                            <p className={aboutStyle.aboutText}>
                                                現在<Text keyboard>東京</Text>でWeb開発者として務めており、{new Date().getFullYear() - 2019}年間で複数のプロジェクトに参画して成功させた経験が蓄積できました。
                                            </p>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <Title level={1}>About Me</Title>
                                            <p className={aboutStyle.aboutText}>
                                                I am from<Text keyboard>China</Text>.
                                                I came to Japan in 2013 and after 2 years Japanese study plus 3 years university research,
                                                I finally graduated from The University of Tokyo with a master degree.
                                            </p>
                                            <p className={aboutStyle.aboutText}>
                                                I currently work in<Text keyboard>Tokyo</Text>as a web developer with {new Date().getFullYear() - 2019} years work experience and several successful projects under my belt.
                                            </p>
                                        </React.Fragment>
                            }
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10, push: 14 }} xl={{ span: 10, push: 14 }} style={{ height: imageContent2Height }} ref={el => imgDivRefs.current[2] = el}>
                        {loadImg[2] && <div className={aboutStyle['about-3']} style={{ width: '100%', height: '100%' }} ></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14, pull: 10 }} xl={{ span: 14, pull: 10 }} style={{ height: textContent2Height }}>
                        <Layout style={{ padding: content1Padding }} lang={selectedLanguage}>
                            {
                                selectedLanguage === I18N['zh'].key ?
                                    <React.Fragment>
                                        <Title level={1}>关于编程</Title>
                                        <p className={aboutStyle.aboutText}>
                                            我热爱<Text keyboard>创造新事物</Text>，把一个想法从无到有实现出来能够给我巨大的成就感，而编程于我便是实现这些想法的有力工具。
                                        </p>
                                        <p className={aboutStyle.aboutText}>
                                            而且在日新月异的计算机世界里，<Text keyboard>学无止境</Text>是基本准则，学习一项新技术、语言或者框架都可以让我保持新鲜感和求知欲。
                                        </p>
                                    </React.Fragment>
                                    : selectedLanguage === I18N['ja'].key ?
                                        <React.Fragment>
                                            <Title level={1}>なぜプログラマーに？</Title>
                                            <p className={aboutStyle.aboutText}>
                                                <Text keyboard>ものづくり</Text>が好きで、プログラマーは、コードを書いてゼロからきちんと働くシステムまで作成し、ものづくりの達成感のある仕事ですから。
                                            </p>
                                            <p className={aboutStyle.aboutText}>
                                                また、いつも変化が激しいIT業界では、常に新しい技術や言語、フレームワークなどを<Text keyboard>勉強</Text>することで刺激を受け、日々の成長は実感できますから。
                                            </p>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <Title level={1}>Why Coding ?</Title>
                                            <p className={aboutStyle.aboutText}>
                                                I like<Text keyboard>Creating Stuff</Text>and that's exactly what coding does.
                                                It makes a idea from zero to reality, from which I got great excitement and satisfaction.
                                            </p>
                                            <p className={aboutStyle.aboutText}>
                                                Besides, the world of computer science is always Changing.
                                                <Text keyboard>Learning</Text> a new technology, language, design pattern or framework keeps me passionate.
                                            </p>
                                        </React.Fragment>
                            }
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 10 }} style={{ height: imageContent2Height }} ref={el => imgDivRefs.current[3] = el}>
                        {loadImg[3] && <div className={aboutStyle['about-4']} style={{ width: '100%', height: '100%' }} ></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }} xl={{ span: 14 }} style={{ height: textContent2Height }}>
                        <Layout style={{ padding: content2Padding }} lang={selectedLanguage}>
                            {
                                selectedLanguage === I18N['zh'].key ?
                                    <React.Fragment>
                                        <Title level={1}>联系本人</Title>
                                        <div className={aboutStyle.aboutText} style={{ marginBottom: '1em' }}>
                                            如果您有任何问题需要咨询，请发送邮件至 <Text copyable underline>shurintou@gmail.com</Text>，
                                            或在下方 <Text underline><Link onClick={scrollToGitalk}>留言板</Link></Text> 处留下简讯。
                                        </div>
                                        <p className={aboutStyle.aboutText}>
                                            如果您觉得本站的内容不错对您起到了帮助，麻烦您给本站的 <Text underline><Link href="https://github.com/shurintou/my_blog" target="_blank">Github 仓库</Link></Text> 点星，谢谢。
                                        </p>
                                    </React.Fragment>
                                    : selectedLanguage === I18N['ja'].key ?
                                        <React.Fragment>
                                            <Title level={1}>お問い合わせ</Title>
                                            <div className={aboutStyle.aboutText} style={{ marginBottom: '1em' }}>
                                                何かご用がございましたら、お気軽に <Text copyable underline>shurintou@gmail.com</Text> まで聞いていただくか、
                                                下記の <Text underline><Link onClick={scrollToGitalk}>メッセージボード</Link></Text> にコメントしてください。
                                            </div>
                                            <p className={aboutStyle.aboutText}>
                                                また、当サイトがお気に入りでしたら、<Text underline><Link href="https://github.com/shurintou/my_blog" target="_blank">Github リポジトリ</Link></Text> にスターをいただければ幸いです。
                                            </p>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <Title level={1}>Getting in Touch</Title>
                                            <div className={aboutStyle.aboutText} style={{ marginBottom: '1em' }}>
                                                If you need any further information, please feel free to contact me at <Text copyable underline>shurintou@gmail.com</Text>,
                                                or just leave a message to the <Text underline><Link onClick={scrollToGitalk}>message board</Link></Text> below.
                                            </div>
                                            <p className={aboutStyle.aboutText}>
                                                If you are interested in this blog, or think the content of the blog is helpful, it would be very kind of you to star the <Text underline><Link href="https://github.com/shurintou/my_blog" target="_blank">blog's Github repository</Link></Text> .
                                            </p>
                                        </React.Fragment>
                            }
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={1} sm={1} md={3} lg={3} xl={3}>
                    </Col>
                    <Col xs={22} sm={22} md={18} lg={18} xl={18}>
                        <Gitalk postId={config.aboutProps.messageBoardIssueId} shouldRender={true} />
                    </Col>
                </Row>
            </Space>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>
    )
}

const AboutModule = () => <AboutCompo />
export default AboutModule

