import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { getLocalHtmlLang } from '../../utils/userAgent'
import { LanguageState } from '../../types/index'


const initialState: LanguageState = {
    value: getLocalHtmlLang(),
}


export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        changeLocalLanguage: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
    },
})

export const { changeLocalLanguage } = languageSlice.actions

export const selectCount = (state: RootState) => state.language.value

export default languageSlice.reducer