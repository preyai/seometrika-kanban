import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Button, Card, FormControl, IconButton, InputBase, Paper, TextField, Typography, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppDispatch } from "../../utils/store";
import Task from "../Task/Task";
import Column from "../Column/Column";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { getCurrent } from "../../redux/boards";
import { Add, Close } from "@mui/icons-material";
import { createList, createListLocal, createTaskLocal, getLists, getTasks, moveTask, reset, updateTaskLocal } from "../../redux/board";
import client from "../../utils/feathers";
import { Lists, Tasks } from "kanban-api";
import NewColumn from "../NewColumn/NewColumn";

function Board() {

  // Получение данных из Redux-стора
  const { lists, tasks } = useAppSelector((state) => state.board);
  const { current } = useAppSelector((state) => state.boards);

  // Получение диспетчера Redux
  const dispatch = useAppDispatch();

  // Получение параметров URL
  const { projectId } = useParams();

  // Загрузка текущего проекта при изменении параметров URL
  useEffect(() => {
    if (projectId) dispatch(getCurrent(projectId));
  }, [projectId]);

  // Загрузка списков и задач при изменении текущего проекта
  useEffect(() => {

    if (current) {
      dispatch(getLists());
      dispatch(getTasks());

      // Подписка на событие создания задачи
      client.service("tasks").on("created", (task: Tasks) => {
        if (task.board === current._id) dispatch(createTaskLocal(task));
      });

      client.service("tasks").on("patched", (task: Tasks) => {
        if (task.board === current._id) dispatch(updateTaskLocal(task));
      });

      client.service("lists").on("created", (list: Lists) => {
        if (list.board === current._id) dispatch(createListLocal(list));
      });
    }
  }, [current]);

  // Сброс данных при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, []);

  // Обработка события окончания перетаскивания задачи
  const onDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (destination) {
      dispatch(
        moveTask({
          task: draggableId,
          list: destination.droppableId,
          order: destination.index,
        })
      );
    }
  };

  // Отображение компонента, если текущий проект существует
  if (current) {
    return (
      <Box>

        <Box style={{ display: "flex", gap: 20 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            {/* Отображение списка колонок */}
            {lists &&
              lists.map((list, ind) => (
                <Droppable key={ind} droppableId={`${list._id}`}>
                  {(provided) => (
                    <Column list={list} provided={provided}>
                      {/* Отображение задач в колонке */}
                      {tasks &&
                        tasks
                          .filter((t) => t.list === list._id)
                          .sort((a, b) => a.order - b.order)
                          .map((item, index) => (
                            <Draggable
                              key={item._id.toString()}
                              draggableId={`${item._id}`}
                              index={item.order}
                            >
                              {(provided) => (
                                <Task task={item} provided={provided} />
                              )}
                            </Draggable>
                          ))}
                      {provided.placeholder}
                    </Column>
                  )}
                </Droppable>
              ))}
            {/* Форма для добавления новой колонки */}
            <NewColumn />
          </DragDropContext>
        </Box>
      </Box>
    );
  }
}

export default Board;