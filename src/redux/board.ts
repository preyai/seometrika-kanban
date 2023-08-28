import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ClientApplication, Lists } from 'kanban-api'
import { Tasks } from 'kanban-api'
import client from '../utils/feathers'
import { RootState } from '../utils/store'
import { TasksClientService } from 'kanban-api/lib/services/tasks/tasks.shared'
import { FeathersService } from '@feathersjs/feathers'

type BoardState = {
    lists: Lists[], // Массив колонок
    tasks: Tasks[], // Массив задач
}

// Асинхронное действие для получения списка колонок
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

// Асинхронное действие для получения списка задач
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

// Асинхронное действие для создания новой колонки
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

// Асинхронное действие для создания новой задачи
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

// Асинхронное действие для перемещения задачи
export const moveTask = createAsyncThunk(
    'board/moveTask',
    async ({ task, list, order }: {
        task: string,
        list: string,
        order: number
    }, thunkApi) => {
        const state: RootState = thunkApi.getState() as RootState
        try {
            // const tasks = state.board.tasks.filter(t => t.list === list && t._id !== task).sort((a, b) => a.order - b.order)
            let n = 0

            console.log(state.board.tasks)
            const tasks = [...state.board.tasks]
                .sort((a, b) => a.order - b.order)
                .map(t => {
                    if (t._id.toString() === task) {
                        return { ...t, ...{ order: order, list: list } }
                    }
                    if (t.list === list && t._id.toString() !== task) {

                        const o = n !== order ? n : ++n
                        n++
                        return { ...t, ...{ order: o } }
                    }
                    return t
                })

            client.service('tasks').patch(task, {
                order,
                list
            })
            console.log(tasks);

            return tasks
        } catch (error) {
            console.log(error);

            return null
        }
    }
)

// Исходное состояние
const initialState: BoardState = {} as BoardState

// Создание среза
export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        reset: (state) => {
            state.lists = []
            state.tasks = []
        },
        createTaskLocal: (state, action: PayloadAction<Tasks>) => {
            state.tasks.push(action.payload)
        },
        updateTaskLocal: (state, action: PayloadAction<Tasks>) => {
            state.tasks.splice(state.tasks.findIndex(t => t._id == action.payload._id), 1, action.payload)
        },
        createListLocal: (state, action: PayloadAction<Lists>) => {
            state.lists.push(action.payload)
        },
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
            //   if (action.payload)
            //     state.tasks.push(action.payload)
        })
        builder.addCase(moveTask.fulfilled, (state, action) => {
            if (action.payload)
                state.tasks = action.payload
        })
    },
})

// Экспорт действий
export const { reset, createTaskLocal, updateTaskLocal, createListLocal } = boardSlice.actions

export default boardSlice.reducer