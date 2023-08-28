import { IconButton, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { Add, Delete } from "@mui/icons-material"
import { add, get, remove } from "../../redux/boards"
import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import client from "../../utils/feathers"


function ProjectsList() {
    const [title, setTitle] = useState("")
    const { list } = useAppSelector(state => state.boards)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!list) {
            dispatch(get())
        }
        client.service('boards').on('created',()=>{
            dispatch(get())
        })
    }, [])

    const handler = (e: FormEvent) => {
        e.preventDefault()
        dispatch(add({ title }))
        setTitle("")
    }

    return (
        <List>
            {list && list.map(p =>
                <ListItem
                    disablePadding
                    key={p._id.toString()}
                    onClick={() => navigate(`/projects/${p._id}`)}
                    secondaryAction={
                        <IconButton aria-label="comment" onClick={() => dispatch(remove(p._id.toString()))}>
                            <Delete />
                        </IconButton>
                    }
                >
                    <ListItemButton>
                        <ListItemText primary={p.title} />
                    </ListItemButton>
                </ListItem>
            )}
            <ListItem
                component="form"
                onSubmit={handler}
                secondaryAction={
                    <IconButton aria-label="comment" onClick={handler}>
                        <Add />
                    </IconButton>
                }
            >
                {/* <ListItemButton> */}
                <TextField
                    label="new project"
                    variant='standard'
                    size="small"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* </ListItemButton> */}

            </ListItem>
        </List>
    )
}

export default ProjectsList