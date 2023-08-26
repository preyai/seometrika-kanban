import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Button, Card, Paper, Typography, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createColumn, createTask, deleteColumn, moveTask } from "../../redux/tasks";
import { AppDispatch } from "../../utils/store";
import Task from "../Task/Task";
import Column from "../Column/Column";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCurrent } from "../../redux/projects";




function Board() {
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


    if (current)
        return (
            <div>
                <Button
                    onClick={() => dispatch(createColumn())}
                >
                    Add new group
                </Button>
                <Button
                    type="button"
                    onClick={() => {
                        if (columns.length > 0)
                            dispatch(createTask({ label: "task", column: columns[0].id }))
                    }}
                >
                    Add new item
                </Button>
                <div style={{ display: "flex" }}>
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
                    </DragDropContext>
                </div>
            </div>
        );
}

export default Board
