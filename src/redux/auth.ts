import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { User } from 'kanban-api'
import client from '../feathers'



type AuthState = {
    user: User | null
    accessToken: string | null
    error: string | null
}


const onStart = async (): Promise<AuthState> => {
    try {
        const result = await client.reAuthenticate()
        return {
            accessToken: result.accessToken,
            user: result.user,
            error: null
        }
    } catch (error) {
        return {
            accessToken: null,
            user: null,
            error: null
        }
    }
}

export const authenticate = createAsyncThunk(
    'auth/authenticate',
    async ({ email, password }: { email: string, password: string }): Promise<AuthState> => {
        try {
            const result = await client.authenticate({
                strategy: 'local',
                email,
                password
            })

            return {
                accessToken: result.accessToken,
                user: result.user,
                error: null
            }
        } catch (error: any) {
            return {
                accessToken: null,
                user: null,
                error: error.message
            }
        }

    }
)
export const reAuthenticate = createAsyncThunk(
    'auth/reAuthenticate',
    async (): Promise<AuthState> => {
        try {
            const result = await client.reAuthenticate()

            return {
                accessToken: result.accessToken,
                user: result.user,
                error: null
            }
        } catch (error: any) {
            return {
                accessToken: null,
                user: null,
                error: error.message
            }
        }

    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    client.logout
)

const slice = createSlice({
    name: 'auth',
    initialState: await onStart(),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(authenticate.fulfilled, (state, action) => {
            if (action.payload.user && action.payload.accessToken) {
                state.accessToken = action.payload.accessToken
                state.user = action.payload.user
            }
            else {
                state.error = action.payload.error
            }
        })
        builder.addCase(reAuthenticate.fulfilled, (state, action) => {
            if (action.payload.user && action.payload.accessToken) {
                state.accessToken = action.payload.accessToken
                state.user = action.payload.user
            }
            else {
                state.error = action.payload.error
            }
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.accessToken = null
            state.user = null
        })
    },
})

export const { } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
