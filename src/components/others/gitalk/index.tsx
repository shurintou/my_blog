import React, { useEffect } from 'react'
import Gitalk from "gitalk"
import 'gitalk/dist/gitalk.css'
import { GitalkProps } from '../../../types/index'
import config from '../../../config/config'

const GitalkCompo: React.FC<GitalkProps> = (props) => {
    const { blogId } = props

    useEffect(() => {
        function renderGitalk(blogId: number) {
            let gitalkProps = config.gitProps
            gitalkProps.number = blogId
            gitalkProps.perPage = config.blogProps.commentCountPerPage
            const gitalk = new Gitalk(gitalkProps)
            gitalk.render('gitalk-container')
        }
        renderGitalk(blogId)

        /* eslint-disable-next-line */
    }, [])

    return (
        <div id="gitalk-container"></div>
    )
}

const GitalkModule = (props: GitalkProps) => <GitalkCompo {...props}></GitalkCompo>

export default GitalkModule