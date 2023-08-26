import { Box, Button, IconButton, InputBase, Paper, TextField, Typography, styled } from "@mui/material";
import { Lists } from "kanban-api";
import { FormEvent, PropsWithChildren, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { DroppableProvided } from "react-beautiful-dnd";
import { createTask, deleteColumn } from "../../redux/tasks";
import { IColumn } from "../../types/task";
import { Add, Close } from "@mui/icons-material";

interface ColumnProps extends PropsWithChildren {
    col: IColumn
    provided: DroppableProvided
}

export const ColumnPaper = styled(Paper)({
    width: 300,
    padding: 2
})

function Column({ children, col, provided }: ColumnProps) {
    const [newTitle, setNewTitle] = useState("")
    const dispatch = useAppDispatch()

    const addHandler = (e: FormEvent) => {
        e.preventDefault()
        dispatch(createTask({
            label: newTitle,
            column: col.id
        }))
        setNewTitle("")
    }

    return (
        <Box>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, mb: 2 }}
            >
                <Typography sx={{ ml: 1, flex: 1 }}>{col.label}</Typography>
                <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    onClick={() => dispatch(deleteColumn(col.id))}
                >
                    <Close />
                </IconButton>
            </Paper>

            <ColumnPaper
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {children}
                {/* {provided.placeholder} */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}
                    onSubmit={addHandler}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="New task"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                    />
                    <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        onClick={addHandler}
                    >
                        <Add />
                    </IconButton>
                </Paper>
            </ColumnPaper>
        </Box>
    )
}

export default Column