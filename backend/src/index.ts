import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { UserType, Day, PrismaClient } from '@prisma/client'

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
    .findMany({
      select: { id: true, name: true },
    })
    .then((years) => res.json(years))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching years' })
    )
})

app.get('/api/rooms/:yearId', (req, res) => {
  prisma.room
    .findMany({
      where: { yearId: Number(req.params.yearId) },
      select: { id: true, name: true },
    })
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

app.get('/api/student-classes/:yearId', (req, res) => {
  prisma.studentClass
    .findMany({
      where: { yearId: Number(req.params.yearId) },
      select: { id: true, name: true },
    })
    .then((studentClasses) => res.json(studentClasses))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error fetching student classes' })
    )
})

app.post('/api/student-classes/:yearId', async (req, res) => {
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

app.patch('/api/student-classes/:id', (req, res) => {
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

app.delete('/api/student-classes/:id', (req, res) => {
  prisma.studentClass
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Student class deleted successfully' }))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error deleting student class' })
    )
})

app.get('/api/rooms/:yearId', (req, res) => {
  prisma.room
    .findMany({
      where: { yearId: Number(req.params.yearId) },
      select: { id: true, name: true },
    })
    .then((rooms) => res.json(rooms))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching rooms' })
    )
})

app.get('/api/teachers', (_req, res) => {
  prisma.teacher
    .findMany({ select: { id: true, name: true, initials: true } })
    .then((teachers) => res.json(teachers))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching teachers' })
    )
})

app.get(
  '/api/timetable-elements/:yearId/:term/:studentClassId/:day',
  (req, res) => {
    prisma.timetableElement
      .findMany({
        where: {
          yearId: Number(req.params.yearId),
          term: Number(req.params.term),
          studentClassId: Number(req.params.studentClassId),
          day: req.params.day as Day,
        },
        select: {
          id: true,
          day: true,
          period: true,
          startTime: true,
          endTime: true,
          alternating: true,
          split: true,
          studentClassSubjectTeacher: {
            select: {
              id: true,
              subject: { select: { id: true, name: true, abbreviation: true } },
              teacher: { select: { id: true, name: true, initials: true } },
            },
          },
          room: { select: { id: true, name: true } },
          evenWeekStudentClassSubjectTeacher: {
            select: {
              id: true,
              subject: { select: { id: true, name: true, abbreviation: true } },
              teacher: { select: { id: true, name: true, initials: true } },
            },
          },
          evenWeekRoom: { select: { id: true, name: true } },
          group2StudentClassSubjectTeacher: {
            select: {
              id: true,
              subject: { select: { id: true, name: true, abbreviation: true } },
              teacher: { select: { id: true, name: true, initials: true } },
            },
          },
          group2Room: { select: { id: true, name: true } },
        },
      })
      .then((timetableElements) => res.json(timetableElements))
      .catch((err) =>
        res
          .status(500)
          .json({ error: err.message || 'Error fetching timetable elements' })
      )
  }
)

app.get(
  '/api/available-timetable-elements/:yearId/:studentClassId',
  (req, res) => {
    prisma.studentClassSubjectTeacher
      .findMany({
        where: {
          yearId: Number(req.params.yearId),
          studentClassId: Number(req.params.studentClassId),
        },
        include: {
          subject: true,
          teacher: true,
        },
      })
      .then((timetableElements) => res.json(timetableElements))
      .catch((err) =>
        res.status(500).json({
          error: err.message || 'Error fetching available timetable elements',
        })
      )
  }
)

app.post(
  '/api/timetable-elements/:yearId/:term/:studentClassId',
  async (req, res) => {
    const { element } = req.body

    if (!element) {
      res.status(400).json({ error: 'Element is required' })
      return
    }

    prisma.timetableElement
      .create({
        data: {
          term: Number(req.params.term),
          day: element.day,
          period: element.period,
          startTime: element.startTime,
          endTime: element.endTime,
          alternating: element.alternating,
          split: element.split,
          yearId: Number(req.params.yearId),
          studentClassId: Number(req.params.studentClassId),
          studentClassSubjectTeacherId: element.studentClassSubjectTeacher.id,
          roomId: element.room.id,
        },
      })
      .then((newElement) =>
        res.json({
          message: 'Timetable element added successfully',
          id: newElement.id,
        })
      )
      .catch((err) =>
        res
          .status(500)
          .json({ error: err.message || 'Error adding timetable element' })
      )
  }
)

app.patch('/api/timetable-elements/:id', (req, res) => {
  const { element } = req.body

  if (!element) {
    res.status(400).json({ error: 'Element is required' })
    return
  }

  prisma.timetableElement
    .update({
      where: { id: Number(req.params.id) },
      data: {
        day: element.day,
        period: element.period,
        startTime: element.startTime,
        endTime: element.endTime,
        alternating: element.alternating,
        split: element.split,
        studentClassSubjectTeacherId: element.studentClassSubjectTeacher.id,
        roomId: element.room.id,
      },
    })
    .then(() => res.json({ message: 'Timetable element edited successfully' }))
    .catch((err) =>
      res.status(500).json({
        error: err.message || 'Error editing timetable element',
      })
    )
})

app.delete('/api/timetable-elements/:id', (req, res) => {
  prisma.timetableElement
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Timetable element deleted successfully' }))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error deleting timetable element' })
    )
})

app.patch('/api/available-timetable-elements/:id', (req, res) => {
  const { element } = req.body

  if (!element) {
    res.status(400).json({ error: 'Element is required' })
    return
  }

  prisma.studentClassSubjectTeacher
    .update({
      where: { id: Number(req.params.id) },
      data: { classesPerWeek: element.classesPerWeek },
    })
    .then(() =>
      res.json({ message: 'Available timetable element edited successfully' })
    )
    .catch((err) =>
      res.status(500).json({
        error: err.message || 'Error editing available timetable element',
      })
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
