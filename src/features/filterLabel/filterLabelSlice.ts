import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { FilterLabelState, Label } from '../../types/index'


const initialState: FilterLabelState = {
    value: [],
}


export const filterLabelSlice = createSlice({
    name: 'filterLabel',
    initialState,
    reducers: {
        changeFilterLabel: (state, action: PayloadAction<Array<Label>>) => {
            state.value = action.payload
        },
    },
})

export const { changeFilterLabel } = filterLabelSlice.actions

export const selectCount = (state: RootState) => state.filterLabel.value

export default filterLabelSlice.reducer