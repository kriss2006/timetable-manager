import express, { json } from 'express'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import User from './models/User.js'

dotenv.config()

async function generateHashedPassword() {
  const password = 'admin'
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  console.log(hashedPassword)
}

generateHashedPassword()
const app = express()

app.use(json())
app.use(cors())

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
    let user = await User.findByUsername(username)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' })
    const payload = {
      user: {
        id: user.id,
        username: user.username,
      },
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
