import { Button, CardActions, Dialog, DialogContent, TextField, Typography } from "@mui/material"
import { Tasks } from "kanban-api";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { changeTask } from "../../redux/board";

type TaskDetailProps = {
    task: Tasks
}



function TaskDetail({ task }: TaskDetailProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(task.description)
    const [changed, setChanged] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        setChanged(task.description !== value)
    }, [value, task])

    const saveHandler = () => {
        dispatch(changeTask({
            taskId: task._id.toString(),
            task: {
                description: value
            }
        }))
    }

    return (
        <>
            <CardActions>
                <Button size="small" onClick={() => setOpen(true)}>Show More</Button>
            </CardActions>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth='md'
                fullWidth={true}
            >
                <DialogContent>
                    <Typography variant="h4" component="h2">
                        {task.number}. {task.title}
                    </Typography>

                    <TextField
                        multiline
                        variant="standard"
                        fullWidth={true}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                    />

                    {changed &&
                        <Button
                            onClick={saveHandler}
                        >
                            Save
                        </Button>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default TaskDetail