import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { SearchKeywordState } from '../../types/index'


const initialState: SearchKeywordState = {
    value: '',
}

export const searchKeywordSlice = createSlice({
    name: 'searchKeyword',
    initialState,
    reducers: {
        changeSearchKeyword: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
    },
})

export const { changeSearchKeyword } = searchKeywordSlice.actions

export const selectCount = (state: RootState) => state.searchKeyword.value

export default searchKeywordSlice.reducer