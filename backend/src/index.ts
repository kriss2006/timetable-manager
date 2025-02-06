import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { Day, PrismaClient } from '@prisma/client'

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

  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    res.status(400).json({ message: 'User already exists' })
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
          name: newUser.name,
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
      res.status(500).json({ message: err.message || 'Server error' })
    )
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!username) {
    res.status(400).json({ message: 'Username is required' })
    return
  }

  if (!password) {
    res.status(400).json({ message: 'Password is required' })
    return
  }

  prisma.user
    .findUnique({
      where: { username },
    })
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' })
        return
      }
      bcrypt.compare(password, user.passwordHash).then((isMatch) => {
        if (!isMatch) {
          res.status(400).json({ message: 'Invalid credentials' })
          return
        }
        const payload = {
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            type: user.type,
          },
        }
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
        res.json({ token })
      })
    })
    .catch((err) =>
      res.status(500).json({ message: err.message || 'Server error' })
    )
})

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body

  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded !== 'object') {
    res.status(400).json({ message: 'No token' })
  } else {
    const existingUser = await prisma.user.findUnique({
      where: { username: decoded.email },
    })

    if (existingUser) {
      const payload = {
        user: {
          id: existingUser.id,
          name: existingUser.name,
          username: existingUser.username,
          type: existingUser.type,
        },
      }
      const newToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
      res.json({ token: newToken })
    } else {
      const newUser = await prisma.user.create({
        data: {
          name: decoded.name,
          username: decoded.email,
          passwordHash: 'google',
          type: 'student',
        },
      })

      const payload = {
        user: {
          id: newUser.id,
          name: newUser.name,
          username: newUser.username,
          type: newUser.type,
        },
      }

      const newToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' })

      res.status(201).json({
        message: 'User created successfully',
        token: newToken,
      })
    }
  }
})

app.get('/api/users', (_req, res) => {
  const order = ['super_admin', 'admin', 'teacher', 'student']

  prisma.user
    .findMany({
      select: { id: true, name: true, username: true, type: true },
      orderBy: [{ username: 'asc' }, { name: 'asc' }],
    })
    .then((users) => {
      users.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))
      res.json(users)
    })
    .catch((err) => {
      res.status(500).json({ message: err.message || 'Error fetching users' })
    })
})

app.patch('/api/users/:id', (req, res) => {
  const { name, username, type } = req.body

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

  if (!type) {
    res.status(400).json({ error: 'Type is required' })
    return
  }

  prisma.user
    .update({
      where: { id: Number(req.params.id) },
      data: { name, username, type },
    })
    .then(() => res.json({ message: 'User edited successfully' }))
    .catch((err) =>
      res.status(500).json({ message: err.message || 'Error editing user' })
    )
})

app.delete('/api/users/:id', (req, res) => {
  prisma.user
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'User deleted successfully' }))
    .catch((err) =>
      res.status(500).json({ message: err.message || 'Error deleting user' })
    )
})

app.get('/api/years/:yearName', (req, res) => {
  const yearName = req.params.yearName

  prisma.year
    .findUnique({
      where: { name: yearName },
    })
    .then((year) => {
      if (year) {
        res.json({ id: year.id })
      } else {
        res.status(404).json({ error: 'Year not found' })
      }
    })
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching year' })
    )
})

app.get('/api/years', (_req, res) => {
  prisma.year
    .findMany({
      select: { id: true, name: true },
      orderBy: { name: 'desc' },
    })
    .then((years) => res.json(years))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching years' })
    )
})

app.post('/api/years', (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length !== 9) {
    res.status(400).json({ error: 'Name must be 9 characters' })
    return
  }

  prisma.year
    .create({
      data: {
        name,
      },
    })
    .then((newYear) =>
      res.json({ message: 'Year added successfully', id: newYear.id })
    )
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error adding year' })
    )
})

app.patch('/api/years/:id', (req, res) => {
  const { name } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length !== 9) {
    res.status(400).json({ error: 'Name must be 9 characters' })
    return
  }

  prisma.year
    .update({
      where: { id: Number(req.params.id) },
      data: { name },
    })
    .then(() => res.json({ message: 'Year edited successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error editing year' })
    )
})

app.delete('/api/years/:id', (req, res) => {
  prisma.year
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Year deleted successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error deleting year' })
    )
})

app.get('/api/rooms/:yearId', (req, res) => {
  prisma.room
    .findMany({
      where: { yearId: Number(req.params.yearId) },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
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
      orderBy: {
        name: 'asc',
      },
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

app.get('/api/subjects/:yearId', (req, res) => {
  prisma.subject
    .findMany({
      where: { yearId: Number(req.params.yearId) },
      select: { id: true, name: true, abbreviation: true },
      orderBy: {
        name: 'asc',
      },
    })
    .then((subjects) => res.json(subjects))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching subjects' })
    )
})

app.post('/api/subjects/:yearId', (req, res) => {
  const { name, abbreviation } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  if (abbreviation && abbreviation.length > 32) {
    res.status(400).json({ error: 'Abbreviation must be up to 32 characters' })
    return
  }

  prisma.subject
    .create({
      data: {
        name,
        abbreviation,
        yearId: Number(req.params.yearId),
      },
    })
    .then((newSubject) =>
      res.json({ message: 'Subject added successfully', id: newSubject.id })
    )
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error adding subject' })
    )
})

app.patch('/api/subjects/:id', (req, res) => {
  const { name, abbreviation } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  if (abbreviation && abbreviation.length > 32) {
    res.status(400).json({ error: 'Abbreviation must be up to 32 characters' })
    return
  }

  prisma.subject
    .update({
      where: { id: Number(req.params.id) },
      data: { name, abbreviation },
    })
    .then(() => res.json({ message: 'Subject edited successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error editing subject' })
    )
})

app.delete('/api/subjects/:id', (req, res) => {
  prisma.subject
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Subject deleted successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error deleting subject' })
    )
})

app.get('/api/teachers', (_req, res) => {
  prisma.teacher
    .findMany({
      select: { id: true, name: true, initials: true },
      orderBy: { name: 'asc' },
    })
    .then((teachers) => res.json(teachers))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching teachers' })
    )
})

app.post('/api/teachers', (req, res) => {
  const { name, initials } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  if (!initials) {
    res.status(400).json({ error: 'Initials are required' })
    return
  }

  if (initials.length > 4) {
    res.status(400).json({ error: 'Initials must be up to 4 characters' })
    return
  }

  prisma.teacher
    .create({
      data: {
        name,
        initials,
      },
    })
    .then((newTeacher) =>
      res.json({ message: 'Teacher added successfully', id: newTeacher.id })
    )
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error adding teacher' })
    )
})

app.patch('/api/teachers/:id', (req, res) => {
  const { name, initials } = req.body

  if (!name) {
    res.status(400).json({ error: 'Name is required' })
    return
  }

  if (name.length > 255) {
    res.status(400).json({ error: 'Name must be up to 255 characters' })
    return
  }

  if (!initials) {
    res.status(400).json({ error: 'Initials are required' })
    return
  }

  if (initials.length > 4) {
    res.status(400).json({ error: 'Initials must be up to 4 characters' })
    return
  }

  prisma.teacher
    .update({
      where: { id: Number(req.params.id) },
      data: { name, initials },
    })
    .then(() => res.json({ message: 'Teacher edited successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error editing teacher' })
    )
})

app.delete('/api/teachers/:id', (req, res) => {
  prisma.teacher
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Teacher deleted successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error deleting teacher' })
    )
})

app.get('/api/curricula/:yearId/:studentClassId', (req, res) => {
  prisma.curriculum
    .findMany({
      where: {
        yearId: Number(req.params.yearId),
        studentClassId: Number(req.params.studentClassId),
      },
      select: {
        id: true,
        classesPerWeek: true,
        subject: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            initials: true,
          },
        },
      },
      orderBy: [
        {
          subject: {
            name: 'asc',
          },
        },
        {
          teacher: {
            name: 'asc',
          },
        },
      ],
    })
    .then((curricula) => res.json(curricula))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error fetching curricula' })
    )
})

app.post('/api/curricula/:yearId/:studentClassId', (req, res) => {
  const { classesPerWeek, subjectId, teacherId } = req.body

  if (!classesPerWeek) {
    res.status(400).json({ error: 'Classes per week is required' })
    return
  }

  if (classesPerWeek < 1) {
    res.status(400).json({ error: 'Classes per week must be at least 1' })
    return
  }

  if (!subjectId) {
    res.status(400).json({ error: 'Subject is required' })
    return
  }

  if (!teacherId) {
    res.status(400).json({ error: 'Teacher is required' })
    return
  }

  prisma.curriculum
    .create({
      data: {
        studentClassId: Number(req.params.studentClassId),
        classesPerWeek: Number(classesPerWeek),
        subjectId: Number(subjectId),
        teacherId: Number(teacherId),
        yearId: Number(req.params.yearId),
      },
    })
    .then((newCurriculum) =>
      res.json({
        message: 'Curriculum added successfully',
        id: newCurriculum.id,
      })
    )
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error adding curriculum' })
    )
})

app.patch('/api/curricula/:id', (req, res) => {
  const { classesPerWeek, subjectId, teacherId } = req.body

  if (!classesPerWeek) {
    res.status(400).json({ error: 'Classes per week is required' })
    return
  }

  if (classesPerWeek < 1) {
    res.status(400).json({ error: 'Classes per week must be at least 1' })
    return
  }

  if (!subjectId) {
    res.status(400).json({ error: 'Subject is required' })
    return
  }

  if (!teacherId) {
    res.status(400).json({ error: 'Teacher is required' })
    return
  }

  prisma.curriculum
    .update({
      where: { id: Number(req.params.id) },
      data: {
        classesPerWeek,
        subjectId: Number(subjectId),
        teacherId: Number(teacherId),
      },
    })
    .then(() => res.json({ message: 'Curriculum edited successfully' }))
    .catch((err) =>
      res.status(500).json({ error: err.message || 'Error editing curriculum' })
    )
})

app.delete('/api/curricula/:id', (req, res) => {
  prisma.curriculum
    .delete({ where: { id: Number(req.params.id) } })
    .then(() => res.json({ message: 'Curriculum deleted successfully' }))
    .catch((err) =>
      res
        .status(500)
        .json({ error: err.message || 'Error deleting curriculum' })
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
          curriculum: {
            select: {
              id: true,
              subject: { select: { id: true, name: true, abbreviation: true } },
              teacher: { select: { id: true, name: true, initials: true } },
            },
          },
          room: { select: { id: true, name: true } },
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
  '/api/teacher-free/:teacherId/:day/:startTime/:endTime/:studentClassId',
  (req, res) => {
    prisma.timetableElement
      .findMany({
        where: {
          AND: [
            {
              curriculum: {
                teacherId: Number(req.params.teacherId),
              },
            },
            { day: req.params.day as Day },
            { studentClassId: { not: Number(req.params.studentClassId) } },
            {
              OR: [
                {
                  AND: [
                    { startTime: { lte: req.params.startTime } },
                    { endTime: { gte: req.params.startTime } },
                  ],
                },
                {
                  AND: [
                    { startTime: { lte: req.params.endTime } },
                    { endTime: { gte: req.params.endTime } },
                  ],
                },
                {
                  AND: [
                    { startTime: { gte: req.params.startTime } },
                    { endTime: { lte: req.params.endTime } },
                  ],
                },
              ],
            },
          ],
        },
      })
      .then((elements) => {
        res.status(elements.length > 0 ? 409 : 200).send()
      })
      .catch((err) =>
        res.status(500).json({
          error: err.message || 'Error checking if the teacher is free',
        })
      )
  }
)

app.get(
  '/api/room-free/:roomId/:day/:startTime/:endTime/:studentClassId',
  (req, res) => {
    prisma.timetableElement
      .findMany({
        where: {
          AND: [
            { roomId: Number(req.params.roomId) },
            { day: req.params.day as Day },
            { studentClassId: { not: Number(req.params.studentClassId) } },
            {
              OR: [
                {
                  AND: [
                    { startTime: { lte: req.params.startTime } },
                    { endTime: { gte: req.params.startTime } },
                  ],
                },
                {
                  AND: [
                    { startTime: { lte: req.params.endTime } },
                    { endTime: { gte: req.params.endTime } },
                  ],
                },
                {
                  AND: [
                    { startTime: { gte: req.params.startTime } },
                    { endTime: { lte: req.params.endTime } },
                  ],
                },
              ],
            },
          ],
        },
      })
      .then((elements) => {
        res.status(elements.length > 0 ? 409 : 200).send()
      })
      .catch((err) =>
        res.status(500).json({
          error: err.message || 'Error checking if the teacher is free',
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
          yearId: Number(req.params.yearId),
          studentClassId: Number(req.params.studentClassId),
          curriculumId: element.curriculum.id,
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
        curriculumId: element.curriculum.id,
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
