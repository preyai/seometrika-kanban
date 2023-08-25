import { DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import { Box, Button, Card,  Paper, Typography, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createColumn, createTask, deleteColumn, moveTask } from "../../redux/tasks";
import { AppDispatch } from "../../store";
import Task from "../Task/Task";



const Column = styled(Paper)({
    width: 300,
    padding: 2
})

function Board() {
    const { columns, tasks } = useAppSelector(state => state.tasks)
    const dispatch: AppDispatch = useAppDispatch()

    const onDragEnd = (result: DropResult) => {
        const { destination } = result

        if (destination) {
            console.log(destination);

            dispatch(moveTask({ task: Number(result.draggableId), column: Number(destination.droppableId), order: destination.index }))

        }
    }



    return (
        <div>
            <Button
                onClick={() => dispatch(createColumn())}
            >
                Add new group
            </Button>
            <Button
                type="button"
                onClick={() => {
                    if (columns.length > 0)
                        dispatch(createTask({ label: "task", column: columns[0].id }))
                }}
            >
                Add new item
            </Button>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {columns.map((col, ind) => (
                        <Droppable key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <Box>
                                    <Typography variant="h6">{col.label}
                                        <Button onClick={() => dispatch(deleteColumn(col.id))}>x</Button>
                                    </Typography>
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
                                                        <Task task={item} />
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
