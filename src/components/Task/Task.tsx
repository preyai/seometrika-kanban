import { Box, Button, Card, CardActions, CardContent, Modal, Typography } from "@mui/material";
import { ITask } from "../../types/task";
import { useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { deleteTask } from "../../redux/tasks";
import { DraggableProvided } from "react-beautiful-dnd";
import { Tasks } from "kanban-api";

type TaskProps = {
    task: Tasks,
    provided: DraggableProvided
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function Task({ task, provided }: TaskProps) {
    const [open, setOpen] = useState(false)
    const dispatch = useAppDispatch()

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

                <Typography variant="body2">
                    task description {task.order}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => setOpen(true)}>Show More</Button>
            </CardActions>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {task.number}. {task.title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        task description {task.order}
                    </Typography>
                    <Button
                    // onClick={() => dispatch(deleteTask(task._id))}
                    >
                        delete
                    </Button>
                </Box>
            </Modal>
        </Card>
    )
}

export default Task