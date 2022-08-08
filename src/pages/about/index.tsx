import React, { useEffect, useState, useRef } from 'react'
import { Layout, Row, Col, Typography, Space, Divider, BackTop, } from 'antd'
import Gitalk from '../../components//others/gitalk'
import config from '../../config/config'
import { debounce, doScrolling } from '../../utils/common'
import aboutStyle from './index.module.css'
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


    return (
        <Layout>
            <Space direction="vertical" size={'large'}>
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12, push: 12 }} xl={{ span: 12, push: 12 }} style={{ height: imageContent1Height }} ref={el => imgDivRefs.current[0] = el}>
                        {loadImg[0] && <div className={aboutStyle['about-1']} style={{ width: '100%', height: '100%' }}></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12, pull: 12 }} xl={{ span: 12, pull: 12 }} style={{ height: textContent1Height }}>

                        <Layout style={{ padding: content1Padding }}>
                            <Title level={1}>About Blog</Title>
                            <p className={aboutStyle.aboutText}>
                                This is a blog that I regularly share some thoughts and experiences in my coding life.
                            </p>
                            <p className={aboutStyle.aboutText}>
                                The topic will mostly includes web development languages that address most facets of<Text keyboard>Web Programming</Text>,
                                such as Java, Javascript and so on.
                            </p>
                        </Layout>

                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 10 }} style={{ height: imageContent2Height }} ref={el => imgDivRefs.current[1] = el}>
                        {loadImg[1] && <div className={aboutStyle['about-2']} style={{ width: '100%', height: '100%' }}></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }} xl={{ span: 14 }} style={{ height: textContent2Height }}>
                        <Layout style={{ padding: content2Padding }}>
                            <Title level={1}>About Me</Title>
                            <p className={aboutStyle.aboutText}>
                                I am from<Text keyboard>China</Text>.
                                I came to Japan in 2013 and after 2 years Japanese study plus 3 years university research,
                                I finally graduated from The University of Tokyo with a master degree.
                            </p>
                            <p className={aboutStyle.aboutText}>
                                I currently work in<Text keyboard>Tokyo</Text>as a web developer with {new Date().getFullYear() - 2019} years work experience and several successful projects under my belt.
                            </p>
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10, push: 14 }} xl={{ span: 10, push: 14 }} style={{ height: imageContent2Height }} ref={el => imgDivRefs.current[2] = el}>
                        {loadImg[2] && <div className={aboutStyle['about-3']} style={{ width: '100%', height: '100%' }} ></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14, pull: 10 }} xl={{ span: 14, pull: 10 }} style={{ height: textContent2Height }}>
                        <Layout style={{ padding: content1Padding }}>
                            <Title level={1}>Why Coding ?</Title>
                            <p className={aboutStyle.aboutText}>
                                I like<Text keyboard>Creating Stuff</Text>and that's exactly what coding does.
                                It makes a idea from zero to reality, from which I got great excitement and satisfaction.
                            </p>
                            <p className={aboutStyle.aboutText}>
                                Besides, the world of computer science is always<Text keyboard>Changing</Text>.
                                Learning a new technology, language, design pattern or framework keeps me passionate.
                            </p>
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 10 }} style={{ height: imageContent2Height }} ref={el => imgDivRefs.current[3] = el}>
                        {loadImg[3] && <div className={aboutStyle['about-4']} style={{ width: '100%', height: '100%' }} ></div>}
                    </Col>
                    <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }} xl={{ span: 14 }} style={{ height: textContent2Height }}>
                        <Layout style={{ padding: content2Padding }}>
                            <Title level={1}>Getting in Touch</Title>
                            <div className={aboutStyle.aboutText} style={{ marginBottom: '1em' }}>
                                If you need any further information, please feel free to contact me at <Text copyable underline>shurintou@gmail.com</Text>,
                                or just leave a message to the <Text underline><Link onClick={scrollToGitalk}>message board</Link></Text> below.
                            </div>
                            <p className={aboutStyle.aboutText}>
                                If you are interested in this blog, or think the content of the blog is helpful, it would be very kind of you to star the <Text underline><Link href="https://github.com/shurintou/my_blog" target="_blank">blog repository</Link></Text> .
                            </p>
                        </Layout>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col xs={1} sm={1} md={3} lg={3} xl={3}>
                    </Col>
                    <Col xs={22} sm={22} md={18} lg={18} xl={18}>
                        <Gitalk blogId={config.aboutProps.messageBoardIssueId} />
                    </Col>
                </Row>
            </Space>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>
    )
}

const AboutModule = () => <AboutCompo />
export default AboutModule

