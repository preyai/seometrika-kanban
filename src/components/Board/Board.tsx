import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Button, Card, FormControl, IconButton, InputBase, Paper, TextField, Typography, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppDispatch } from "../../utils/store";
import Task from "../Task/Task";
import Column from "../Column/Column";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { getCurrent } from "../../redux/boards";
import { Add, Close } from "@mui/icons-material";
import { createList, getLists, getTasks, moveTask } from "../../redux/board";




function Board() {
    const [newTitle, setNewTitle] = useState("")
    // const { columns, tasks } = useAppSelector(state => state.tasks)
    const { lists, tasks } = useAppSelector(state => state.board)
    const { current } = useAppSelector(state => state.boards)
    const dispatch: AppDispatch = useAppDispatch()
    const { projectId } = useParams()

    useEffect(() => {
        if (projectId)
            dispatch(getCurrent(projectId))
    }, [projectId])

    useEffect(() => {
        if (current) {
            dispatch(getLists(current._id.toString()))
            dispatch(getTasks(current._id.toString()))
        }
    }, [current])

    const onDragEnd = (result: DropResult) => {
        const { draggableId, destination } = result

        if (destination) {
            dispatch(moveTask({
                task: draggableId,
                list: destination.droppableId,
                order: destination.index
            }))
        }
    }

    const addHandler = (e: FormEvent) => {
        e.preventDefault()
        if (current)
            dispatch(createList({
                title: newTitle,
                board: current._id.toString()
            }))
        setNewTitle("")
    }


    if (current)
        return (
            <div>
                <div style={{ display: "flex", gap: 20 }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {lists &&
                            lists.map((list, ind) => (
                                <Droppable key={ind} droppableId={`${list._id}`}>
                                    {(provided) => (
                                        <Column list={list} provided={provided}>
                                            {tasks &&
                                                tasks.filter(t => t.list === list._id).sort((a, b) => a.order - b.order).map((item, index) => (
                                                    <Draggable
                                                        key={item._id.toString()}
                                                        draggableId={`${item._id}`}
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
