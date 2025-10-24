import { Check, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function App() {
  const [tasks, setTasks] = useState([])
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    try {
      const res = await fetch('http://localhost:3000/api.tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const newTask = await res.json()
      setTasks([newTask, ...tasks])
      setFormData({ title: '', description: '' })
    } catch (err) {
      console.error('Error creating task:', err)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !completed })
      })
      const updatedTask = await res.json()
      setTasks(tasks.map((task) => task._id === id ? updatedTask : task))
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE'
      })
      setTasks(tasks.filter((task) => task._id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Task Manager</h1>
          <p className="text-muted-foreground">Organize your tasks efficeiently</p>
        </div>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Create a new task to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                placeholder='Task title'
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className='w-full'
              />
              <Textarea
                placeholder='Task description (optional)'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className='w-full'
              />
              <Button type='submit' className='w-full'>
                <Plus className='w-4 h-4 mr-2' />
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card>
              <CardContent className='flex items-center justify-center py-12'>
                <p className='text-muted-foreground'>No tasks yet. Create your first task above!</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task._id} className={task.completed ? 'opacity-75' : ''}>
                <CardContent className='p-6'>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mb-3 ${task.completed ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {task.description}
                        </p>
                      )}
                      <p className='text-xs text-muted-foreground'>
                        Created: {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => toggleComplete(task._id, task.completed)}
                        className={task.completed ? 'bg-green-59 border-green-200' : ''}
                      >
                        {task.completed ? (
                          <Check className='w-4 h-4 text-green-600' />
                        ) : (
                          <X className='w-4 h-4' />
                        )}
                      </Button>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => deleteTask(task._id)}
                        className='hover:bg-red-50 hover:border-red-200'
                      >
                        <Trash2 className='w-4 h-4 text-red-500' />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
