import React from 'react'
import { Layout, Row, Col, Typography, Space, Divider, } from 'antd'
import aboutStyle from './index.module.css'
const { Text, Title } = Typography

export default class About extends React.Component<{}, { [key: string]: any }>  {
    constructor(props: Object) {
        super(props)
        this.state = {
            windowInnerWdith: window.innerHeight,
            windowResizeFunc: () => {
                this.setState({ windowInnerWdith: window.innerWidth })
            }
        }
    }

    componentDidMount() {
        this.setState({ windowInnerWdith: window.innerWidth })
        window.addEventListener('resize', this.state.windowResizeFunc)
    }

    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.state.windowResizeFunc)
    }

    render() {
        const imageContent1Height = this.state.windowInnerWdith >= 992 ? '35em' : '25em'
        const textContent1Height = this.state.windowInnerWdith >= 992 ? '35em' : ''
        const imageContent2Height = this.state.windowInnerWdith >= 992 ? '30em' : '25em'
        const textContent2Height = this.state.windowInnerWdith >= 992 ? '30em' : ''
        const content1Padding = this.state.windowInnerWdith >= 992 ? '3.75rem 3rem 1.75rem 3rem' : '1em 0rem 0rem'
        const content2Padding = this.state.windowInnerWdith >= 992 ? '4.25rem 3rem 1.75rem 4.25rem' : '1em 0rem 0rem'
        return (
            <Layout>
                <Space direction="vertical" size={'large'}>
                    <Row>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12, push: 12 }} xl={{ span: 12, push: 12 }} style={{ height: imageContent1Height }}>
                            <div className={aboutStyle['about-1']} style={{ width: '100%', height: '100%' }}></div>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12, pull: 12 }} xl={{ span: 12, pull: 12 }} style={{ height: textContent1Height }}>

                            <Layout style={{ padding: content1Padding }}>
                                <Title level={1}>About Blog</Title>
                                <p className={aboutStyle.aboutText}>
                                    This is a blog that I share some thoughts and experiences in my coding career.
                                    The topic will mostly includes
                                    <Text keyboard>Java (Spring)</Text>,
                                    <Text keyboard>Javascript (React, Vue, Typescript)</Text>,
                                    and web development languages that address most facets of web programming,
                                    such as &nbsp;
                                    <Text underline>HTML</Text>,&nbsp;
                                    <Text underline>CSS( less, sass)</Text>,&nbsp;
                                    <Text underline>JQuery</Text>
                                    &nbsp;in frontend,&nbsp;
                                    <Text underline>SQL</Text>,&nbsp;
                                    <Text underline>Redis</Text>,&nbsp;
                                    <Text underline>Ngnix</Text>,&nbsp;
                                    <Text underline>NodeJs</Text>
                                    &nbsp;in backend, and so on.
                                </p>
                            </Layout>

                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 10 }} style={{ height: imageContent2Height }}>
                            <div className={aboutStyle['about-2']} style={{ width: '100%', height: '100%' }}></div>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14 }} xl={{ span: 14 }} style={{ height: textContent2Height }}>
                            <Layout style={{ padding: content2Padding }}>
                                <Title level={1}>About Me</Title>
                                <p className={aboutStyle.aboutText}>
                                    My name is Shurintou. I am from
                                    <Text keyboard>China</Text>.
                                    I came to<Text keyboard>Japan</Text>in 2013 and
                                    after 5 years study I graduated from<Text keyboard>The University Of Tokyo</Text>.
                                    I currently work in <Text keyboard>Tokyo</Text>
                                    as a web developer with {new Date().getFullYear() - 2019} years work experience and several successful projects under my belt.
                                    One of my key strengths is<Text keyboard>problem-solving</Text>.
                                    I am adept at identifying the cause of problems and generating the most beneficial solutions.
                                </p>
                            </Layout>
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10, push: 14 }} xl={{ span: 10, push: 14 }} style={{ height: imageContent2Height }}>
                            <div className={aboutStyle['about-3']} style={{ width: '100%', height: '100%' }}></div>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 14, pull: 10 }} xl={{ span: 14, pull: 10 }} style={{ height: textContent2Height }}>
                            <Layout style={{ padding: content1Padding }}>
                                <Title level={1}>Why Code ?</Title>
                                <p className={aboutStyle.aboutText}>
                                    I like<Text keyboard>creating stuff</Text> and that's just what code does.
                                    Before becoming a full-time job programmer,
                                    I spent plenty of time to design and develop my own computer games to have fun with my friend,
                                    which is just like "You are the creator of the world".
                                    Besides, the world of computer science is changing all the time.
                                    Learning a new technology, language, design pattern or framework can always keep me<Text keyboard>passionate</Text>.
                                </p>
                            </Layout>
                        </Col>
                    </Row>
                </Space>
            </Layout>
        )
    }
}
