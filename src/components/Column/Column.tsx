import { Box, Button, Paper, Typography, styled } from "@mui/material";
import { Lists } from "kanban-api";
import { PropsWithChildren } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { DroppableProvided } from "react-beautiful-dnd";
import { deleteColumn } from "../../redux/tasks";
import { IColumn } from "../../types/task";

interface ColumnProps extends PropsWithChildren {
    col: IColumn
    provided: DroppableProvided
}

export const ColumnPaper = styled(Paper)({
    width: 300,
    padding: 2
})

function Column({ children, col, provided }: ColumnProps) {
    const dispatch = useAppDispatch()
    return (
        <Box>
            <Typography variant="h6">{col.label}
                <Button onClick={() => dispatch(deleteColumn(col.id))}>x</Button>
            </Typography>
            <ColumnPaper
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {children}
                {/* {provided.placeholder} */}
            </ColumnPaper>
        </Box>
    )
}

export default Column