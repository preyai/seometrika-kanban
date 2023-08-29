import { Box, Button, Card, CardActions, CardContent, Modal, Typography } from "@mui/material";
import { ITask } from "../../types/task";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { deleteTask } from "../../redux/tasks";
import { DraggableProvided } from "react-beautiful-dnd";
import { Tasks } from "kanban-api";
import TaskDetail from "../TaskDetail/TaskDetail";

type TaskProps = {
    task: Tasks,
    provided: DraggableProvided
}



function Task({ task, provided }: TaskProps) {

    return (
        <Card
            sx={{ marginBottom: 1 }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
        >
            <CardContent>

                <Typography variant="h5" component="div">
                    {task.number}. {task.title}
                </Typography>

                <Typography
                    sx={{
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                    }}
                    variant="body2"
                >
                    {task.description}
                </Typography>
            </CardContent>
            <TaskDetail task={task} />

        </Card>
    )
}

export default Task