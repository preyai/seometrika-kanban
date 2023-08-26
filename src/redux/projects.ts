import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'

import { Projects } from 'kanban-api'
import client from '../utils/feathers'
import { Paginated } from '@feathersjs/feathers'

type ProjectsState = {
    data: Projects[]
    current: Projects | null
}

const initial = async (): Promise<ProjectsState> => {
    try {
        const list = await client.service("projects").find({
            paginate: { max: 100 }
        })
        console.log(list);
        
        return {
            data: list.data,
            current: null
        }
    } catch (error) {
        return {} as ProjectsState
    }
}

export const getCurrent = createAsyncThunk(
    'projects/getCurrent',
    async (id: string) => {
        try {
            const project = await client.service('projects').get(id)
            return project
        } catch (error) {
            return null
        }
    }
)

export const get = createAsyncThunk(
    'projects/get',
    async () => {
        try {
            const list = await client.service("projects").find({
                paginate: { max: 100 }
            })
            return list
        } catch (error) {
            return {} as Paginated<Projects>
        }

    }
)

export const add = createAsyncThunk(
    'projects/add',
    async ({ title }: { title: string }) => {
        await client.service("projects").create({
            title
        })
        const list = await client.service("projects").find({
            paginate: { max: 100 }
        })
        console.log(list);

        return list
    }
)

export const remove = createAsyncThunk(
    'projects/remove',
    async (id: string) => {
        await client.service('projects').remove(id)
        const list = await client.service("projects").find({
            paginate: { max: 100 }
        })
        console.log(list);

        return list
    }
)

// Define the initial state using that type
const initialState: ProjectsState = await initial()

export const projectsSlice = createSlice({
    name: 'projects',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(get.fulfilled, (state, action) => {
            state.data = action.payload.data
        })
        builder.addCase(add.fulfilled, (state, action) => {
            state.data = action.payload.data
        })
        builder.addCase(remove.fulfilled, (state, action) => {
            state.data = action.payload.data
        })
        builder.addCase(getCurrent.fulfilled, (state, action) => {
            state.current = action.payload
        })
    },
})

export const { } = projectsSlice.actions

export default projectsSlice.reducer