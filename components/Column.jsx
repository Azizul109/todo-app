'use client'
import Task from './Task'
import AddTask from './AddTask'
import { useTasks } from '@/context/TaskContext'
import { COLUMNS } from '@/utils/constants'

const Column = ({ columnKey, title }) => {
  const { tasks, setIsModalOpen, setSelectedTask } = useTasks()
  const columnTasks = tasks[columnKey]
  const columnColors = COLUMNS[columnKey]?.color || {
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  }

  const handleAddTask = () => {
    if (columnKey !== 'todo') return
    setIsModalOpen(true)
    setSelectedTask(null)
  }

  return (
    <div className={`p-4 rounded-lg border ${columnColors.bg} ${columnColors.border}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-200">{title}</h2>
        <span className="px-2 py-1 bg-white rounded-full text-sm">
          {columnTasks.length}
        </span>
      </div>

      {columnKey === 'todo' && (
        <button 
          onClick={handleAddTask}
          className="w-full mb-4 p-2 bg-blue-200 rounded-lg border border-dashed hover:bg-indigo-200 transition"
        >
          + Add Task
        </button>
      )}

      <div className="space-y-3">
        {columnTasks.map(task => (
          <Task key={task.id} task={task} columnKey={columnKey} />
        ))}
      </div>

      {columnTasks.length === 0 && (
        <p className="text-gray-500 italic text-center py-4">No tasks here</p>
      )}
    </div>
  )
}

export default Column