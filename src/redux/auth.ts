import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { User } from 'kanban-api'
import client from '../feathers'



type AuthState = {
    user: User | null
    token: string | null
}

type AuthResult = {
    token?: string,
    user?: User
    error?: string
}

export const authenticate = createAsyncThunk(
    'auth/authenticate',
    async ({ email, password }: { email: string, password: string }): Promise<AuthResult> => {
        try {
            const result = await client.authenticate({
                strategy: 'local',
                email,
                password
            })

            return {
                token: result.accessToken,
                user: result.user
            }
        } catch (error: any) {
            return {
                error: error.message
            }
        }

    }
)
export const reAuthenticate = createAsyncThunk(
    'auth/reAuthenticate',
    async (): Promise<AuthResult> => {
        try {
            const result = await client.reAuthenticate()

            return {
                token: result.accessToken,
                user: result.user
            }
        } catch (error: any) {
            return {
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
    initialState: { user: null, token: null } as AuthState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(authenticate.fulfilled, (state, action) => {
            if (action.payload.user && action.payload.token) {
                state.token = action.payload.token
                state.user = action.payload.user
            }
        }),
            builder.addCase(reAuthenticate.fulfilled, (state, action) => {
                if (action.payload.user && action.payload.token) {
                    state.token = action.payload.token
                    state.user = action.payload.user
                }
            }),
            builder.addCase(logout.fulfilled, (state) => {
                state.token = null
                state.user = null
            })
    },
})

export const { } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
