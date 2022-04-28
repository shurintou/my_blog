import { Component } from 'react'
import { Layout, Row, Col, Typography, Tooltip, Space, Divider, Image } from 'antd'
import javascriptImg from '../../static/images/icons/javascript.png'
import typescriptImg from '../../static/images/icons/typescript.png'
import javaImg from '../../static/images/icons/java.png'
import vueImg from '../../static/images/icons/vuejs.png'
import reactImg from '../../static/images/icons/reactjs.png'
import nodeImg from '../../static/images/icons/nodejs.png'
import springImg from '../../static/images/icons/spring.png'
import pythonImg from '../../static/images/icons/python.png'
import chinaImg from '../../static/images/icons/china.png'
import japanImg from '../../static/images/icons/japan.png'
import americaImg from '../../static/images/icons/america.png'
import { AboutDataList, LanguageItem } from '../../types/index'
const { Link, Text, Paragraph } = Typography
const fontSize = { fontSize: '2em' }
const boxHeight = { height: '15rem' }



export default class About extends Component {
    render() {
        const aboutDataList: AboutDataList = {
            Skills: [
                { language: 'Javascript', imgSrc: javascriptImg, link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
                { language: 'Typescript', imgSrc: typescriptImg, link: 'https://www.typescriptlang.org/' },
                { language: 'Vue.js', imgSrc: vueImg, link: 'https://vuejs.org/' },
                { language: 'React.js', imgSrc: reactImg, link: 'https://reactjs.org/' },
                { language: 'Node.js', imgSrc: nodeImg, link: 'https://nodejs.org/' },
                { language: 'Java', imgSrc: javaImg, link: 'https://www.java.com/' },
                { language: 'Spring', imgSrc: springImg, link: 'https://spring.io/' },
            ],
            Learning: [
                { language: 'Python', imgSrc: pythonImg, link: 'https://www.python.org/' },

            ],
            Languages: [
                { language: 'chinese', imgSrc: chinaImg, link: '' },
                { language: 'japanese', imgSrc: japanImg, link: '' },
                { language: 'english', imgSrc: americaImg, link: '' },
            ]
        }
        return (
            <Layout>
                <Row gutter={10}>
                    <Col
                        xs={{ offset: 2, span: 20 }}
                        sm={{ offset: 2, span: 10 }}
                        md={{ offset: 2, span: 10 }}
                        lg={{ offset: 2, span: 9 }}
                        xl={{ offset: 4, span: 7 }}
                        style={boxHeight}
                    >
                        {
                            Object.keys(aboutDataList).map(key =>
                                <Paragraph key={key}>
                                    <Text style={fontSize}>
                                        <Space wrap size={[15, 0]}>
                                            {key + ':'}
                                            {
                                                aboutDataList[key].map((item: LanguageItem) =>
                                                    <Tooltip title={item.language} key={item.language}>
                                                        {item.link && item.link !== '' ?
                                                            <a rel="noreferrer" target="_blank" href={item.link}>
                                                                <Image preview={false} src={item.imgSrc} width={35}></Image>
                                                            </a>
                                                            :
                                                            <Image preview={false} src={item.imgSrc} width={35}></Image>}
                                                    </Tooltip>
                                                )}
                                        </Space>
                                    </Text>
                                </Paragraph>
                            )
                        }
                        <Divider />
                    </Col>
                    <Col
                        xs={{ offset: 2, span: 20 }}
                        sm={{ offset: 12, span: 10 }}
                        md={{ offset: 12, span: 10 }}
                        lg={{ offset: 13, span: 9 }}
                        xl={{ offset: 13, span: 7 }}
                        style={boxHeight}
                    >
                        <Divider />
                        <Paragraph>
                            <Text style={fontSize}>
                                Please feel free to contact me if you need any further information.
                            </Text>
                        </Paragraph>
                        <Paragraph>
                            <Text style={fontSize}>
                                <Link href="mailto:shurintou@gmail.com?subject = Hello" target="_blank">
                                    shurintou@gmail.com
                                </Link>
                            </Text>
                        </Paragraph>
                    </Col>
                </Row>
            </Layout>
        )
    }
}
