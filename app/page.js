'use client'
import { TaskProvider } from '@/context/TaskContext'
import Column from '@/components/Column'
import TaskModal from '@/components/TaskModal'
import { DndProviders } from '@/components/DndProviders'
import { TypewriterText } from '@/components/TypewriterText'

export default function Home() {
  const messages = [
    'Organize your tasks efficiently',
    'Drag and drop to update status',
    'Right-click tasks for quick actions',
    'Set deadlines for ongoing tasks',
    'Celebrate your completed work!'
  ]

  return (
    <TaskProvider>
      <DndProviders>
        <main className="min-h-screen p-8 dark:bg-gray-800 flex flex-col">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
              Todo List Application
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              <Column columnKey="todo" title="New" />
              <Column columnKey="inProgress" title="Ongoing" />
              <Column columnKey="done" title="Done" />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <TypewriterText 
              texts={messages} 
              delay={0.5}
              typingSpeed={30} 
              deletingSpeed={15}
              pauseDuration={1000} 
            />
          </div>
          
          <TaskModal />
        </main>
      </DndProviders>
    </TaskProvider>
  )
}