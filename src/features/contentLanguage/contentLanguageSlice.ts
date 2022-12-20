import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { STORAGE_KEY } from '../../config/constant'
import { contentLanguageListState } from '../../types/index'
import { getLocalHtmlLang } from '../../utils/userAgent'

const localStorageContentLanguageListStr = localStorage.getItem(STORAGE_KEY.contentLanguageList)

const initialState: contentLanguageListState = {
    value: localStorageContentLanguageListStr ? JSON.parse(localStorageContentLanguageListStr) : [getLocalHtmlLang()],
}

export const contentLanguageSlice = createSlice({
    name: 'contentLanguage',
    initialState,
    reducers: {
        changeContentLanguage: (state, action: PayloadAction<Array<string>>) => {
            state.value = action.payload
        },
    },
})

export const { changeContentLanguage } = contentLanguageSlice.actions

export const selectCount = (state: RootState) => state.contentLanguage.value

export default contentLanguageSlice.reducer