export type IColumn = {
    id: number
    label: string
}

export type ITask = {
    id: number
    label: string
    column: number
    order: number
}