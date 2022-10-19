import { Component } from 'react'
import { Avatar } from 'antd'
import { AntDesignOutlined } from '@ant-design/icons'
import avatarJpg from '../../../../static/images/avatar/avatar.jpg'


export default class BlogAvatar extends Component {
    render() {
        return (
            <Avatar
                src={avatarJpg}
                icon={<AntDesignOutlined />}
                shape={'circle'}
                size={{
                    'xs': 100,
                    'sm': 200,
                    'md': 250,
                    'lg': 300,
                    'xl': 300,
                    'xxl': 400,
                }}
            />
        )
    }
}
