import React, { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation, DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";
import { Box, Button, Card, CardActions, CardContent, Paper, Typography, styled } from "@mui/material";

type IColumn = {
    id: string
    label: string
}

type ITask = {
    id: string
    label: string
    column: string
    order: number
}

const Column = styled(Paper)({
    width: 200,
    padding: 1
})

function Board() {
    const [columns, setColumns] = useState<IColumn[]>([]);
    const [tasks, setTasks] = useState<ITask[]>([]);
    const [columnId, setColumnId] = useState(0);
    const [taskId, setTaskId] = useState(0);


    const onDragEnd = (result: DropResult) => {
        const { draggableId, source, destination } = result

        if (destination) {

            setTasks(newTasks => newTasks.map(t => {
                if (t.id === draggableId) {

                    t.column = destination.droppableId
                    t.order = destination.index

                }
                else {
                    if (t.column === destination.droppableId) {
                        if (t.order > destination.index) {
                            t.order = t.order + 1
                        }
                        if (t.order < destination.index) {
                            t.order = t.order - 1
                        }
                    }
                }
                return t
            }))
        }
    }

    const createColumn = (label: string | undefined = undefined) => {
        setColumns((prev) => {
            setColumnId(columnId + 1)
            return [...prev, {
                id: columnId.toString(),
                label: label ? label : `column ${columnId}`
            }]
        })
    }

    const createTask = (label: string, column: string) => {
        setTasks((prev) => {
            setTaskId(taskId + 1)
            return [...prev, {
                id: taskId.toString(),
                label: label,
                column,
                order: tasks.length
            }]
        })
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    createColumn()
                }}
            >
                Add new group
            </button>
            <button
                type="button"
                onClick={() => {
                    if (columns.length > 0)
                        createTask(`task ${taskId}`, columns[0].id)
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
                                                draggableId={item.id}
                                                index={item.order}
                                            >
                                                {(provided, snapshot) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <CardContent>

                                                            <Typography variant="h5" component="div">
                                                                {item.label}
                                                            </Typography>

                                                            <Typography variant="body2">
                                                                task description
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
