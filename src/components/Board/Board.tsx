import { Box } from "@mui/material"
import Column from "../Column"
import Task from "../Task"
import {
    DragDropContext,
    Draggable,
    DraggableLocation,
    Droppable,
    OnDragEndResponder
} from 'react-beautiful-dnd';
import { useState } from "react";

interface ITask {
    id: number
    label: string
}



function getTasks() {

    let id = 0

    function getCol() {
        const random = Math.floor(Math.random() * 9) + 1
        const result: ITask[] = []
        for (let index = 0; index < random; index++) {
            result.push({ label: `task ${index}`, id })
            id++
        }
        return result
    }

    const result: ITask[][] = []
    for (let index = 0; index < 4; index++) {
        result.push(getCol())
    }
    return result
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

function move<T>(source: T[], destination: T[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: { source: T[], destination: T[] } = {
        source: sourceClone,
        destination: destClone
    }

    return result;
};

function Board() {
    const [tasks, setTasks] = useState<ITask[][]>(getTasks())

    const onDragEnd: OnDragEndResponder = (result) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(tasks[sInd], source.index, destination.index);
            const newState = [...tasks];
            newState[sInd] = items;
            setTasks(newState);
        } else {
            const result = move(tasks[sInd], tasks[dInd], source, destination);
            const newState = [...tasks];
            newState[sInd] = result.source;
            newState[dInd] = result.destination;

            setTasks(newState.filter(group => group.length));
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{
                display: "flex",
                gap: 2,
                alignItems: "start"
            }}>
                {tasks.map((col, index) => (
                    <Droppable droppableId={`${index}`} key={index}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {col.map((task, index) => (
                                    <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                        {(provided, snapshot) => (
                                            // <Task label={task.label} />
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {task.label}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        )}
                    </Droppable>
                    // <Column key={index}>
                    //     {col.map((task, index) => (
                    //         <Task label={task.label} key={index} />
                    //     ))}
                    // </Column>
                ))}
            </Box>
        </DragDropContext>
    )
}

export default Board