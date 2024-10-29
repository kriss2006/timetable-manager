import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import User from './models/User.js'
import db from '../config/db.js'

dotenv.config()

const app: express.Application = express()

app.use(json())
app.use(cors())

const jwtSecret = process.env.JWT_SECRET as jwt.Secret
// app.post('/api/signup', async (req, res) => {
//   const { username, password } = req.body

//   try {
//     let user = await User.findByUsername(username)
//     if (user) return res.status(400).json({ message: 'User already exists' })

//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: 'Username and password are required' })
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const userId = await User.create(username, hashedPassword)

//     const payload = {
//       user: { id: userId, username: username },
//     }

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     })

//     res.json({ token })
//   } catch (err) {
//     console.error(err.message)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findByUsername(username)
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' })
      return
    }
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    }

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1h',
    })

    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err || 'Server error' })
  }
})

app.get('/api/year-terms', async (_req, res) => {
  const [yearTerms] = await db.query('SELECT * FROM year_term')
  res.json(yearTerms)
})

app.get('/api/classes/:yearTermId', async (req, res) => {
  try {
    const [classes] = await db.query(
      'SELECT * FROM classes WHERE year_term_id = ?',
      [req.params.yearTermId]
    )
    res.json(classes)
  } catch (err) {
    res.status(500).json({ error: err || 'Error fetching classes' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
