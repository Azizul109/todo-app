"use client";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTask = (task) => {
    setTasks((prev) => ({
      ...prev,
      todo: [task, ...prev.todo],
    }));
    setIsModalOpen(false);
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    setTasks((prev) => {
      const sourceTasks = [...prev[fromColumn]];
      const destTasks = [...prev[toColumn]];
      const taskIndex = sourceTasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) return prev;

      const [movedTask] = sourceTasks.splice(taskIndex, 1);

      const updatedTask = {
        ...movedTask,
        status: toColumn,
        movedAt:
          toColumn === "done" ? new Date().toISOString() : movedTask.movedAt,
      };

      if (toColumn === "inProgress" && !updatedTask.dueDate) {
        updatedTask.dueDate = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString();
      }

      return {
        ...prev,
        [fromColumn]: sourceTasks,
        [toColumn]:
          toColumn === "todo"
            ? [updatedTask, ...destTasks]
            : [...destTasks, updatedTask],
      };
    });
  };

  const updateDueDate = (taskId, dueDate) => {
    setTasks((prev) => ({
      ...prev,
      inProgress: prev.inProgress.map((task) =>
        task.id === taskId ? { ...task, dueDate } : task
      ),
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const activeColumn = findColumnByTaskId(active.id);
    const overColumn = findColumnByTaskId(over.id) || over.id;

    if (activeColumn === overColumn) {
      setTasks((prev) => {
        const column = [...prev[activeColumn]];
        const oldIndex = column.findIndex((task) => task.id === active.id);
        const newIndex = column.findIndex((task) => task.id === over.id);

        const [removed] = column.splice(oldIndex, 1);
        column.splice(newIndex, 0, removed);

        return {
          ...prev,
          [activeColumn]: column,
        };
      });
      return;
    }

    setTasks((prev) => {
      const sourceColumn = [...prev[activeColumn]];
      const destColumn = [...prev[overColumn]];
      const oldIndex = sourceColumn.findIndex((task) => task.id === active.id);
      const newIndex = destColumn.findIndex((task) => task.id === over.id);

      const [removed] = sourceColumn.splice(oldIndex, 1);

      const updatedTask = {
        ...removed,
        status: overColumn,
        movedAt:
          overColumn === "done" ? new Date().toISOString() : removed.movedAt,
      };

      if (overColumn === "inProgress" && !updatedTask.dueDate) {
        updatedTask.dueDate = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString();
      }

      if (newIndex >= 0) {
        destColumn.splice(newIndex, 0, updatedTask);
      } else {
        destColumn.push(updatedTask);
      }

      return {
        ...prev,
        [activeColumn]: sourceColumn,
        [overColumn]: destColumn,
      };
    });
  };

  const findColumnByTaskId = (taskId) => {
    for (const column in tasks) {
      if (tasks[column].some((task) => task.id === taskId)) {
        return column;
      }
    }
    return null;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        moveTask,
        addTask,
        updateDueDate,
        selectedTask,
        setSelectedTask,
        isModalOpen,
        setIsModalOpen,
        handleDragEnd,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
