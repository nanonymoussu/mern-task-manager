import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import connectDB from './config/database.js'
import taskRoutes from './routes/task.route.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Connect to the MongoDB database
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/tasks', taskRoutes)

app.get('/', async (_req, res) => {
  res.json({ message: 'Task API is running' })
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`)
})
