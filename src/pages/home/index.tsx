import React from 'react'
import { Layout, Row, Col, Typography } from 'antd';
import BlogAvatar from '../../components/avatar';
import homeStyle from './index.module.css'
const { Title, Paragraph, Text, Link } = Typography;


export default class Home extends React.Component<{}, { [key: string]: any }> {
    constructor(props: Object) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Layout>
                <Row>
                    <Col
                        xs={{ offset: 1 }}
                        sm={{ offset: 2 }}
                        md={{ offset: 2 }}
                        lg={{ offset: 2 }}
                        xl={{ offset: 4 }}
                    >
                        <BlogAvatar></BlogAvatar>
                        <Typography>
                            <Title style={{ marginTop: '1em' }}>Hello.</Title>
                            <Title level={3}>My name is Shurintou.</Title>
                            <Paragraph>
                                <p className={homeStyle.homeText}>I'm a&nbsp;
                                    <Text underline><Link href="https://en.wikipedia.org/wiki/Web_developer" target="_blank">Web developer</Link></Text>
                                    , now working in Tokyo.</p>
                                <p className={homeStyle.homeText}>I love coding and want to become a full stack engineer.</p>
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

                    </Col>
                </Row>
            </Layout>
        )
    }
}
