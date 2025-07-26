'use client'
import { TaskProvider } from '@/context/TaskContext'
import Column from '@/components/Column'
import TaskModal from '@/components/TaskModal'
import { DndProviders } from '@/components/DndProviders'

export default function Home() {
  return (
    <TaskProvider>
      <DndProviders>
        <main className="min-h-screen p-8 bg-gray-50">
          <h1 className="text-3xl font-bold text-center mb-8">Kanban Task Board</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <Column columnKey="todo" title="To Do" />
            <Column columnKey="inProgress" title="In Progress" />
            <Column columnKey="done" title="Done" />
          </div>
          
          <TaskModal />
        </main>
      </DndProviders>
    </TaskProvider>
  )
}