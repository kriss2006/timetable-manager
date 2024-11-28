import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const teacherPassword = await bcrypt.hash('teacher123', 10)

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      passwordHash: adminPassword,
      type: 'admin',
    },
  })

  const teacherUser = await prisma.user.create({
    data: {
      name: 'Teacher User',
      username: 'teacher',
      passwordHash: teacherPassword,
      type: 'teacher',
    },
  })

  // Create Years
  const year2024 = await prisma.year.create({
    data: { name: '2023-2024' },
  })

  // Create Rooms
  const room1 = await prisma.room.create({
    data: { name: 'Room A', yearId: year2024.id },
  })

  const room2 = await prisma.room.create({
    data: { name: 'Room B', yearId: year2024.id },
  })

  // Create Classes
  const class1 = await prisma.studentClass.create({
    data: { name: '1A', yearId: year2024.id },
  })

  const class2 = await prisma.studentClass.create({
    data: { name: '1B', yearId: year2024.id },
  })

  // Create Subjects
  const math = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      abbreviation: 'Math',
      yearId: year2024.id,
    },
  })

  const science = await prisma.subject.create({
    data: {
      name: 'Science',
      abbreviation: 'Sci',
      yearId: year2024.id,
    },
  })

  // Create Teachers
  const teacher1 = await prisma.teacher.create({
    data: { name: 'John Doe', initials: 'JD' },
  })

  const teacher2 = await prisma.teacher.create({
    data: { name: 'Jane Smith', initials: 'JS' },
  })

  // Assign Subjects to Teachers
  await prisma.subjectTeacher.create({
    data: {
      subjectId: math.id,
      teacherId: teacher1.id,
      yearId: year2024.id,
    },
  })

  await prisma.subjectTeacher.create({
    data: {
      subjectId: science.id,
      teacherId: teacher2.id,
      yearId: year2024.id,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
