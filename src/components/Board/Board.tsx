import React, { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { Box, Button, Card, CardActions, CardContent, Paper, Typography, styled } from "@mui/material";
import { IColumn, ITask } from "../../types/task";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createColumn, createTask, moveTask } from "../../redux/tasks";
import { AppDispatch } from "../../store";



const Column = styled(Paper)({
    width: 200,
    padding: 2
})

function Board() {
    // const [columns, setColumns] = useState<IColumn[]>([]);
    // const [tasks, setTasks] = useState<ITask[]>([]);
    // const [columnId, setColumnId] = useState(0);
    // const [taskId, setTaskId] = useState(0);
    const { columns, tasks } = useAppSelector(state => state.tasks)
    const dispatch: AppDispatch = useAppDispatch()

    const onDragEnd = (result: DropResult) => {
        const { draggableId, source, destination } = result

        if (destination) {
            console.log(destination);
            
            dispatch(moveTask({ task: Number(result.draggableId), column: Number(destination.droppableId), order: destination.index }))
            // setTasks(newTasks => newTasks.map(t => {
            //     if (t.id === draggableId) {

            //         t.column = destination.droppableId
            //         t.order = destination.index

            //     }
            //     else {
            //         if (t.column === destination.droppableId) {
            //             if (t.order > destination.index) {
            //                 t.order = t.order - 1
            //             }
            //             if (t.order < destination.index) {
            //                 t.order = t.order + 1
            //             }
            //         }
            //     }
            //     return t
            // }))
        }
    }



    return (
        <div>
            <p>{columns.length}</p>
            <button
                type="button"
                onClick={() => dispatch(createColumn())}
            >
                Add new group
            </button>
            <button
                type="button"
                onClick={() => {
                    if (columns.length > 0)
                        dispatch(createTask({ label: "task", column: columns[0].id }))
                }}
            >
                Add new item
            </button>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((col, ind) => (
                        <Droppable key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <Box>
                                    <Typography variant="h6">{col.label}</Typography>
                                    <Column
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {tasks.filter(t => t.column === col.id).sort((a, b) => a.order - b.order).map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                draggableId={`${item.id}`}
                                                index={item.order}
                                            >
                                                {(provided, snapshot) => (
                                                    <Card
                                                        sx={{ marginBottom: 1 }}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <CardContent>

                                                            <Typography variant="h5" component="div">
                                                                {item.id}. {item.label}
                                                            </Typography>

                                                            <Typography variant="body2">
                                                                task description {item.order}
                                                            </Typography>
                                                        </CardContent>
                                                        <CardActions>
                                                            <Button size="small">Learn More</Button>
                                                        </CardActions>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Column>
                                </Box>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </div>
    );
}

export default Board
