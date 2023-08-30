import { PayloadAction, createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'

import client from '../utils/feathers'
import { Paginated } from '@feathersjs/feathers'
import { Boards } from 'kanban-api'

type BoardsState = {
    list: Boards[]
    current: Boards | null
}

const initial = async (): Promise<BoardsState> => {
    try {
        const list = await client.service("boards").find({
            paginate: { max: 100 }
        })

        return {
            list: list.data,
            current: null
        }
    } catch (error) {
        return {} as BoardsState
    }
}

export const getCurrent = createAsyncThunk(
    'boards/getCurrent',
    async (id: string) => {
        try {
            const board = await client.service('boards').get(id)
            return board
        } catch (error) {
            return null
        }
    }
)

export const get = createAsyncThunk(
    'boards/get',
    async () => {
        try {
            const list = await client.service("boards").find({
                paginate: { max: 100 }
            })
            return list
        } catch (error) {
            return {} as Paginated<Boards>
        }

    }
)

export const add = createAsyncThunk(
    'boards/add',
    async ({ title }: { title: string }) => {
        await client.service("boards").create({
            title
        })
        const list = await client.service("boards").find({
            paginate: { max: 100 }
        })

        return list
    }
)

export const remove = createAsyncThunk(
    'boards/remove',
    async (id: string) => {
        await client.service('boards').remove(id)
        const list = await client.service("boards").find({
            paginate: { max: 100 }
        })
        console.log(list);

        return list
    }
)

// Define the initial state using that type
const initialState: BoardsState = await initial()

export const boardsSlice = createSlice({
    name: 'boards',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(get.fulfilled, (state, action) => {
            state.list = action.payload.data
        })
        builder.addCase(add.fulfilled, (state, action) => {
            state.list = action.payload.data
        })
        builder.addCase(remove.fulfilled, (state, action) => {
            state.list = action.payload.data
        })
        builder.addCase(getCurrent.fulfilled, (state, action: PayloadAction<Boards | null>) => {
            state.current = action.payload
        })
    },
})

export const { } = boardsSlice.actions

export default boardsSlice.reducer