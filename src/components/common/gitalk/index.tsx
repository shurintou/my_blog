import { useEffect } from 'react'
import Gitalk from "gitalk"
import 'gitalk/dist/gitalk.css'
import { GitalkProps } from '../../../types/index'
import config from '../../../config/config'
import auth from '../../../config/authentication'
import { useAppSelector } from '../../../redux/hooks'

const GitalkCompo = (props: GitalkProps) => {
    const selectedLanguage = useAppSelector((state) => state.language.value)

    const { postId } = props

    useEffect(() => {
        function renderGitalk(postId: number) {
            const gitalkProps = { ...auth, language: selectedLanguage, number: postId, perPage: config.postProps.commentCountPerPage }
            const gitalk = new Gitalk(gitalkProps)
            const gitalkContainerEl = document.querySelector('#gitalk-container')
            if (gitalkContainerEl) { // gitalk didn't offer any api to rerender the component so do it manually.
                let childEls = gitalkContainerEl.childNodes
                childEls.forEach(childEl => {
                    gitalkContainerEl.removeChild(childEl)
                })
            }
            gitalk.render('gitalk-container')
        }
        if (props.shouldRender) renderGitalk(postId)

    }, [postId, selectedLanguage, props.shouldRender])

    return (
        <div id="gitalk-container" lang={selectedLanguage}></div>
    )
}

const GitalkModule = (props: GitalkProps) => <GitalkCompo {...props}></GitalkCompo>

export default GitalkModule