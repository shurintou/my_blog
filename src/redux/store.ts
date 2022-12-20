import { configureStore } from '@reduxjs/toolkit'
import languageReducer from '../features/language/languageSlice'
import filterLabelReducer from '../features/filterLabel/filterLabelSlice'
import contentLanguageReducer from '../features/contentLanguage/contentLanguageSlice'

const store = configureStore({
    reducer: {
        language: languageReducer,
        filterLabel: filterLabelReducer,
        contentLanguage: contentLanguageReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store