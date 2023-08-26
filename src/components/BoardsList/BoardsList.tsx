import { IconButton, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../hooks/redux"
import { Add, Delete } from "@mui/icons-material"
import { add, remove } from "../../redux/boards"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


function ProjectsList() {
    const [title, setTitle] = useState("")
    const { data } = useAppSelector(state => state.boards)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    return (
        <List>
            {data.map(p =>
                <ListItem
                    disablePadding
                    key={p._id.toString()}
                    onClick={()=>navigate(`/projects/${p._id}`)}
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
                secondaryAction={
                    <IconButton aria-label="comment" onClick={() => dispatch(add({ title }))}>
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