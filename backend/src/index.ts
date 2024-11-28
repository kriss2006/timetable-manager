import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

dotenv.config()

const app: express.Application = express()

app.use(json())
app.use(cors())

const jwtSecret = process.env.JWT_SECRET as jwt.Secret

app.post('/api/signup', async (req, res) => {
  const { name, username, password } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  if (!username) {
    res.status(400).json({ error: 'Username is required' })
    return
  }

  if (username.length > 32) {
    res.status(400).json({ error: 'Username must be up to 32 characters' })
    return
  }

  if (!password) {
    res.status(400).json({ error: 'Password is required' })
    return
  }

  if (password.length > 255) {
    res.status(400).json({ error: 'Password must be up to 255 characters' })
    return
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  prisma.user
    .create({
      data: {
        name,
        username,
        passwordHash,
        type: 'student',
      },
    })
    .then((newUser) => {
      const payload = {
        user: {
          id: newUser.id,
          username: newUser.username,
          type: newUser.type,
        },
      }

      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: '1h',
      })

      res.status(201).json({
        message: 'User created successfully',
        id: newUser.id,
        token: token,
      })
    })
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error adding room' })
    )
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  prisma.user.findUnique({ where: { username } }).then((user) => {
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    bcrypt
      .compare(password, user.passwordHash)
      .then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' })
        }

        const payload = {
          user: { id: user.id, username: user.username },
        }

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
        res.json({ token })
      })
      .catch((err) =>
        res.status(500).json({ message: err.message || 'Server error' })
      )
  })
})

app.get('/api/years', (_req, res) => {
  prisma.year
    .findMany()
    .then((years) => res.json(years))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching years' })
    )
})

app.get('/api/rooms/:yearId', (req, res) => {
  prisma.room
    .findMany({ where: { yearId: Number(req.params.yearId) } })
    .then((rooms) => res.json(rooms))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching rooms' })
    )
})

app.post('/api/rooms/:yearId', (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  prisma.room
    .create({
      data: {
        name,
        yearId: Number(req.params.yearId),
      },
    })
    .then((newRoom) =>
      res.json({ message: 'Room added successfully', id: newRoom.id })
    )
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error adding room' })
    )
})

app.patch('/api/rooms/:id', (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  prisma.room
    .update({
      where: { id: Number(req.params.id) },
      data: { name },
    })
    .then(() => res.json({ message: 'Room edited successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error editing room' })
    )
})

app.delete('/api/rooms/:id', (req, res) => {
  prisma.room
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Room deleted successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error deleting room' })
    )
})

app.get('/api/classes/:yearId', (req, res) => {
  prisma.studentClass
    .findMany({ where: { yearId: Number(req.params.yearId) } })
    .then((studentClasses) => res.json(studentClasses))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error fetching student classes' })
    )
})

app.post('/api/classes/:yearId', async (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 5) {
    res.status(400).json({ error: 'Name must be up to 5 characters' })
    return
  }

  prisma.studentClass
    .create({
      data: {
        name,
        yearId: Number(req.params.yearId),
      },
    })
    .then((newStudentClass) =>
      res.json({
        message: 'Student class added successfully',
        id: newStudentClass.id,
      })
    )
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error adding student class' })
    )
})

app.patch('/api/classes/:id', (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 5) {
    res.status(400).json({ error: 'Name must be up to 5 characters' })
    return
  }

  prisma.studentClass
    .update({
      where: { id: Number(req.params.id) },
      data: { name },
    })
    .then(() => res.json({ message: 'Student class edited successfully' }))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error editing student class' })
    )
})

app.delete('/api/classes/:id', (req, res) => {
  prisma.studentClass
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Student class deleted successfully' }))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error deleting student class' })
    )
})

app.get('/api/teachers/:yearId', (_req, res) => {
  prisma.teacher
    .findMany()
    .then((teachers) => res.json(teachers))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching teachers' })
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
