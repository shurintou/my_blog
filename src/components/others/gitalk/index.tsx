import React, { useEffect } from 'react'
import Gitalk from "gitalk"
import 'gitalk/dist/gitalk.css'
import { GitalkProps, BlogsItemRes } from '../../../types/index'
import { getBlogInfo } from '../../../api/blogs'
import config from '../../../config/config'

const GitalkCompo: React.FC<GitalkProps> = (props) => {
    const { blogId } = props

    useEffect(() => {
        function renderGitalk(blogId: number) {
            let gitalkProps = config.gitProps
            gitalkProps.number = blogId
            const gitalk = new Gitalk(gitalkProps)
            gitalk.render('gitalk-container')
        }

        getBlogInfo({ number: blogId }).then((res: BlogsItemRes) => {
            renderGitalk(blogId)
        })

        /* eslint-disable-next-line */
    }, [])

    return (
        <div id="gitalk-container"></div>
    )
}

const GitalkModule = (props: GitalkProps) => <GitalkCompo {...props}></GitalkCompo>

export default GitalkModule