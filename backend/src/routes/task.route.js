import express from 'express'

import Task from '../models/task.model.js'

const router = express.Router()

// Get all tasks
router.get('/', async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found ' })
    }
    res.json(task)
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid task ID format' })
    }
    res.status(500).json({ message: err.message })
  }
})

// Create a task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body
    const task = new Task({ title, description })
    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json(task)
  } catch (err) {
    res.status(400).json({ message: err.messsage })
  }
})

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
