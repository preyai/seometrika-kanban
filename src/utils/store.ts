import { configureStore } from '@reduxjs/toolkit'
import tasks from '../redux/tasks'
import auth from '../redux/auth'
import boards from '../redux/boards'
import board from '../redux/board'

const store = configureStore({
  reducer: {
    tasks: tasks,
    auth: auth,
    boards: boards,
    board: board
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store