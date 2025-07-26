'use client'
import { useState, useEffect } from 'react'
import { useTasks } from '@/context/TaskContext'
import { FiX } from 'react-icons/fi'

const TaskModal = () => {
  const { 
    selectedTask, 
    setSelectedTask, 
    isModalOpen, 
    setIsModalOpen, 
    addTask,
    updateDueDate
  } = useTasks()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title)
      setDescription(selectedTask.description)
      setDueDate(selectedTask.dueDate ? selectedTask.dueDate.slice(0, 16) : '')
    } else {
      setTitle('')
      setDescription('')
      setDueDate('')
    }
  }, [selectedTask])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const taskData = {
      id: selectedTask?.id || Date.now().toString(),
      title,
      description,
      status: selectedTask?.status || 'todo',
      createdAt: selectedTask?.createdAt || new Date().toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    }

    if (selectedTask) {
      // Update existing task
      if (selectedTask.status === 'inProgress' && dueDate) {
        updateDueDate(selectedTask.id, new Date(dueDate).toISOString())
      }
    } else {
      // Add new task
      addTask(taskData)
    }
    
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="dark:bg-gray-600 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {selectedTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button 
            onClick={() => {
              setIsModalOpen(false)
              setSelectedTask(null)
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                setSelectedTask(null)
              }}
              className="px-4 py-2 border rounded dark:text-gray-400 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {selectedTask ? 'Update' : 'Add'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal