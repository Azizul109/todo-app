'use client'
import { createContext, useContext, useState } from 'react'

const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: []
  })
  const [selectedTask, setSelectedTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const addTask = (task) => {
    setTasks(prev => ({
      ...prev,
      todo: [task, ...prev.todo]
    }))
    setIsModalOpen(false)
  }

  const moveTask = (taskId, fromColumn, toColumn) => {
    setTasks(prev => {
      const sourceTasks = [...prev[fromColumn]]
      const destTasks = [...prev[toColumn]]
      const taskIndex = sourceTasks.findIndex(task => task.id === taskId)
      
      if (taskIndex === -1) return prev
      
      const [movedTask] = sourceTasks.splice(taskIndex, 1)
      
      const updatedTask = {
        ...movedTask,
        status: toColumn,
        movedAt: toColumn === 'done' ? new Date().toISOString() : movedTask.movedAt
      }
      
      if (toColumn === 'inProgress' && !updatedTask.dueDate) {
        updatedTask.dueDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      
      return {
        ...prev,
        [fromColumn]: sourceTasks,
        [toColumn]: toColumn === 'todo' ? 
          [updatedTask, ...destTasks] : 
          [...destTasks, updatedTask]
      }
    })
  }

  const updateDueDate = (taskId, dueDate) => {
    setTasks(prev => ({
      ...prev,
      inProgress: prev.inProgress.map(task => 
        task.id === taskId ? { ...task, dueDate } : task
      )
    }))
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      moveTask,
      updateDueDate,
      selectedTask,
      setSelectedTask,
      isModalOpen,
      setIsModalOpen
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => useContext(TaskContext)