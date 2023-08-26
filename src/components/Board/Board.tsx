import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Button, Card, FormControl, IconButton, InputBase, Paper, TextField, Typography, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createColumn, createTask, deleteColumn, moveTask } from "../../redux/tasks";
import { AppDispatch } from "../../utils/store";
import Task from "../Task/Task";
import Column from "../Column/Column";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { getCurrent } from "../../redux/projects";
import { Add, Close } from "@mui/icons-material";




function Board() {
    const [newTitle, setNewTitle] = useState("")
    const { columns, tasks } = useAppSelector(state => state.tasks)
    const { current } = useAppSelector(state => state.projects)
    const dispatch: AppDispatch = useAppDispatch()
    const { projectId } = useParams()

    useEffect(() => {
        if (projectId)
            dispatch(getCurrent(projectId))
    }, [projectId])

    const onDragEnd = (result: DropResult) => {
        const { destination } = result

        if (destination) {
            console.log(destination);

            dispatch(moveTask({ task: Number(result.draggableId), column: Number(destination.droppableId), order: destination.index }))

        }
    }

    const addHandler = (e: FormEvent) => {
        e.preventDefault()
        dispatch(createColumn(newTitle))
        setNewTitle("")
    }


    if (current)
        return (
            <div>
                <div style={{ display: "flex", gap: 20 }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {columns.map((col, ind) => (
                            <Droppable key={ind} droppableId={`${ind}`}>
                                {(provided) => (
                                    <Column col={col} provided={provided}>
                                        {tasks.filter(t => t.column === col.id).sort((a, b) => a.order - b.order).map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={`${item.id}`}
                                                index={item.order}
                                            >
                                                {(provided) => (
                                                    <Task task={item} provided={provided} />
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Column>
                                )}
                            </Droppable>
                        ))}
                        <Box>
                            <Paper
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, mb: 2 }}
                                onSubmit={addHandler}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="New column"
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
                        </Box>
                    </DragDropContext>
                </div>
            </div>
        );
}

export default Board
