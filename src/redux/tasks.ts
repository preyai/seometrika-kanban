import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IColumn, ITask } from '../types/task'

// Define a type for the slice state
export interface TasksState {
  columns: IColumn[]
  tasks: ITask[]
}

// Define the initial state using that type
const initialState: TasksState = {
  columns: [],
  tasks: []
}

export const tasksSlice = createSlice({
  name: 'tasks',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    createColumn: (state, action: PayloadAction<string | undefined>) => {
      let id = state.columns.length
      if (id > 0)
        id = Math.max(...state.columns.map(c => c.id)) + 1
      state.columns.push({
        id: id,
        label: action.payload ? action.payload : `column ${id}`,
      })
      return state
    },
    deleteColumn: (state, action: PayloadAction<number>) => {
      state.columns = state.columns.filter(t => t.id !== action.payload)
      state.tasks = state.tasks.filter(t => t.column !== action.payload)
    },
    createTask: (state, action: PayloadAction<{ label: string, column: number }>) => {
      let id = state.tasks.length
      if (id > 0)
        id = Math.max(...state.tasks.map(t => t.id)) + 1
      state.tasks.push({
        id: id,
        label: action.payload.label,
        column: action.payload.column,
        order: state.tasks.length > 0 ? Math.max(...state.tasks.map(t => t.order)) + 1 : 0
      })
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload)
    },
    moveTask: (state, action: PayloadAction<{ task: number, column: number, order: number }>) => {
      const column = state.columns[action.payload.column]
      const task = state.tasks.find(t => t.id === action.payload.task)
      state.tasks = state.tasks.filter(t => t.id !== action.payload.task)
      let i = 0
      for (const task of state.tasks.filter(t => t.column === column.id).sort((a, b) => a.order - b.order)) {

        task.order = i === action.payload.order ? i + 1 : i
        i++
      }
      if (task) {
        task.column = column.id
        task.order = action.payload.order
        state.tasks.push(task)
      }

    }
  }
})

export const { createColumn, deleteColumn, createTask, deleteTask, moveTask } = tasksSlice.actions

export default tasksSlice.reducer