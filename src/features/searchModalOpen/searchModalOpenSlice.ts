import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { SearchModalOpenState } from '../../types/index'


const initialState: SearchModalOpenState = {
    value: false,
}

export const searchModalOpenSlice = createSlice({
    name: 'searchModalOpen',
    initialState,
    reducers: {
        changeSearchModalOpen: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload
        },
    },
})

export const { changeSearchModalOpen } = searchModalOpenSlice.actions

export const selectCount = (state: RootState) => state.searchModalOpen.value

export default searchModalOpenSlice.reducer