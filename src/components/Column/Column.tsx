import { Box, Button, IconButton, InputBase, Menu, MenuItem, Paper, TextField, Typography, styled } from "@mui/material";
import { Lists } from "kanban-api";
import { FormEvent, MouseEvent, PropsWithChildren, useState } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { DroppableProvided } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import { createTask } from "../../redux/board";

interface ColumnProps extends PropsWithChildren {
    list: Lists
    provided: DroppableProvided
}

export const ColumnPaper = styled(Paper)({
    width: 300,
    padding: 2
})

function Column({ children, list, provided }: ColumnProps) {
    const [newTitle, setNewTitle] = useState("")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const dispatch = useAppDispatch()

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCreate = (e: FormEvent) => {
        e.preventDefault()
        if (!newTitle)
            return
        dispatch(createTask({
            title: newTitle,
            list: list._id.toString()
        }))
        setNewTitle("")
    }

    return (
        <Box>
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300, mb: 2 }}
            >
                <Typography sx={{ ml: 1, flex: 1 }}>{list.title}</Typography>
                <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    onClick={handleMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>Edit</MenuItem>
                    <MenuItem onClick={handleClose}>Delite</MenuItem>
                </Menu>
            </Paper>

            <ColumnPaper
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {children}
                {/* {provided.placeholder} */}
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 2 }}
                    onSubmit={handleCreate}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="New task"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                    />
                    <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        onClick={handleCreate}
                    >
                        <AddIcon />
                    </IconButton>
                </Paper>
            </ColumnPaper>
        </Box>
    )
}

export default Column