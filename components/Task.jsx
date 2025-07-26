'use client'
import { useState, useEffect } from 'react'
import { useTasks } from '@/context/TaskContext'
import { formatDistanceToNow } from 'date-fns'
import { FiMoreVertical } from 'react-icons/fi'

const Task = ({ task, columnKey }) => {
  const { moveTask, setSelectedTask, setIsModalOpen } = useTasks()
  const [showMenu, setShowMenu] = useState(false)
  const [isOverdue, setIsOverdue] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const statusColors = {
    todo: 'bg-blue-500',
    inProgress: 'bg-orange-500',
    done: 'bg-green-500'
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  {columnKey === 'done' && task.movedAt && isClient && (
    <div className="text-xs text-gray-500 mt-2">
      Completed {new Date(task.movedAt).toLocaleString()}
    </div>
  )}

  useEffect(() => {
    if (columnKey === 'inProgress' && task.dueDate) {
      const now = new Date()
      const dueDate = new Date(task.dueDate)
      setIsOverdue(now > dueDate)
      
      if (now > dueDate) {
        const timer = setTimeout(() => {
          alert(`Task "${task.title}" is overdue!`)
        }, 100)
        
        return () => clearTimeout(timer)
      }
    }
  }, [task.dueDate, columnKey, task.title])

  const handleMove = (newColumn) => {
    moveTask(task.id, columnKey, newColumn)
    setShowMenu(false)
  }

  const getMoveOptions = () => {
    const allColumns = ['todo', 'inProgress', 'done']
    return allColumns.filter(col => col !== columnKey)
  }

  return (
    <div 
      className={`p-4 rounded-lg bg-white shadow-sm border relative ${isOverdue ? 'border-red-500' : ''}`}
      onClick={() => {
        setSelectedTask(task)
        setIsModalOpen(true)
      }}
    >
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColors[task.status]}`}></div>
      
      <h3 className="font-bold text-lg mb-1 dark:text-gray-400">{task.title}</h3>
      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
      
      {columnKey === 'inProgress' && task.dueDate && (
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <span className={isOverdue ? 'text-red-500 font-bold' : ''}>
            Due: {new Date(task.dueDate).toLocaleString()}
          </span>
          {isOverdue && (
            <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full">
              Overdue
            </span>
          )}
        </div>
      )}
      
      {columnKey === 'done' && task.movedAt && (
        <div className="text-xs text-gray-500 mt-2">
          Completed {formatDistanceToNow(new Date(task.movedAt), { addSuffix: true })}
        </div>
      )}
      
      <button 
        className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
      >
        <FiMoreVertical />
      </button>
      
      {showMenu && (
        <div 
          className="absolute right-0 bottom-8 bg-white shadow-lg rounded-md py-1 z-10 w-40"
          onClick={(e) => e.stopPropagation()}
        >
          {getMoveOptions().map(option => (
            <button
              key={option}
              className="block w-full text-left px-4 py-2 dark:text-gray-400 hover:bg-gray-300 text-sm"
              onClick={() => handleMove(option)}
            >
              Move to {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Task