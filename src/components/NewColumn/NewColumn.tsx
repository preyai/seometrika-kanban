import { Box, IconButton, InputBase, Paper } from "@mui/material"
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createList } from "../../redux/board";
import { Add } from "@mui/icons-material";

function NewColumn() {
    const [newTitle, setNewTitle] = useState(""); // Состояние для нового заголовка колонки
    const { current } = useAppSelector((state) => state.boards);
    const dispatch = useAppDispatch();

    // Обработка события добавления новой колонки
    const addHandler = (e: FormEvent) => {
        e.preventDefault();
        if (current && newTitle) {
            dispatch(
                createList({
                    title: newTitle,
                    board: current._id.toString(),
                })
            );
        }
        setNewTitle("");
    };

    return (
        <Box>
            <Paper
                component="form"
                sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 300,
                    mb: 2,
                }}
                onSubmit={addHandler}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="New column"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                />
                <IconButton type="button" sx={{ p: "10px" }} onClick={addHandler}>
                    <Add />
                </IconButton>
            </Paper>
        </Box>
    )
}

export default NewColumn