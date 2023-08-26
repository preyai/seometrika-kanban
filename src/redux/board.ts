
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Lists } from 'kanban-api'
import { Tasks } from 'kanban-api'
import client from '../utils/feathers'
import { RootState } from '../utils/store'

type BoardState = {
    lists: Lists[],
    tasks: Tasks[]
}

export const getLists = createAsyncThunk(
    'board/getLists',
    async (board: string) => {
        try {
            const lists = await client.service('lists').find({
                query: {
                    board: board
                }
            })
            return lists.data
        } catch (error) {
            return []
        }
    }
)

export const getTasks = createAsyncThunk(
    'board/getTasks',
    async (board: string) => {
        try {
            const lists = await client.service('tasks').find({
                query: {
                    board: board
                }
            })
            return lists.data
        } catch (error) {
            return []
        }
    }
)

export const createList = createAsyncThunk(
    'board/createList',
    async ({ title, board }: {
        title: string,
        board: string
    }) => {
        try {
            const list = await client.service('lists').create({
                title,
                board
            })
            return list
        } catch (error) {
            return null
        }
    }
)

export const createTask = createAsyncThunk(
    'board/createTask',
    async ({ title, list }: {
        title: string,
        list: string
    }) => {
        try {

            const task = await client.service('tasks').create({
                title,
                list,
            })
            return task
        } catch (error) {
            return null
        }
    }
)

export const moveTask = createAsyncThunk(
    'board/moveTask',
    async ({ task, list, order }: {
        task: string,
        list: string,
        order: number
    }, thunkApi) => {
        const state: RootState = thunkApi.getState() as RootState
        try {
            const tasks = state.board.tasks.filter(t => t.list === list && t._id !== task).sort((a, b) => a.order - b.order)
            let n = 0

            for (const t of tasks) {
                const o = n !== order ? n : ++n
                client.service('tasks').patch(t._id.toString(), {
                    order: o
                })
                n++
            }

            client.service('tasks').patch(task, {
                order,
                list
            })

            if (state.boards.current)
                thunkApi.dispatch(getTasks(state.boards.current._id.toString()))
        } catch (error) {

        }
    }
)

// Define the initial state using that type
const initialState: BoardState = {} as BoardState

export const boardSlice = createSlice({
    name: 'board',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        reset: (state) => {
            state.lists = []
            state.tasks = []
        }
    },
    extraReducers(builder) {
        builder.addCase(getLists.fulfilled, (state, action) => {
            state.lists = action.payload
        })
        builder.addCase(getTasks.fulfilled, (state, action) => {
            state.tasks = action.payload
        })
        builder.addCase(createList.fulfilled, (state, action) => {
            if (action.payload)
                state.lists.push(action.payload)
        })
        builder.addCase(createTask.fulfilled, (state, action) => {
            if (action.payload)
                state.tasks.push(action.payload)
        })
        builder.addCase(moveTask.fulfilled, () => {
            
        })
    },
})

export const { reset } = boardSlice.actions

export default boardSlice.reducer