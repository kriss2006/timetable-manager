import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.timetableElement.deleteMany()
  await prisma.curriculum.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.room.deleteMany()
  await prisma.studentClass.deleteMany()
  await prisma.year.deleteMany()
  await prisma.user.deleteMany()

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash('admin', salt)

  await prisma.user.create({
    data: {
      name: 'Administrator',
      username: 'admin',
      passwordHash,
      type: 'super_admin',
    },
  })

  const years = await Promise.all([
    prisma.year.create({ data: { name: '2023/2024' } }),
    prisma.year.create({ data: { name: '2024/2025' } }),
  ])

  for (const year of years) {
    const rooms = await Promise.all([
      prisma.room.create({ data: { name: '101', yearId: year.id } }),
      prisma.room.create({ data: { name: '102', yearId: year.id } }),
      prisma.room.create({ data: { name: '201', yearId: year.id } }),
      prisma.room.create({ data: { name: '202', yearId: year.id } }),
    ])

    const classes = await Promise.all([
      prisma.studentClass.create({ data: { name: '8A', yearId: year.id } }),
      prisma.studentClass.create({ data: { name: '8B', yearId: year.id } }),
      prisma.studentClass.create({ data: { name: '9A', yearId: year.id } }),
      prisma.studentClass.create({ data: { name: '9B', yearId: year.id } }),
    ])

    const subjects = await Promise.all([
      prisma.subject.create({
        data: {
          name: 'Mathematics',
          abbreviation: 'Math',
          yearId: year.id,
        },
      }),
      prisma.subject.create({
        data: {
          name: 'English Language',
          abbreviation: 'Eng',
          yearId: year.id,
        },
      }),
      prisma.subject.create({
        data: {
          name: 'Physics',
          abbreviation: 'Phys',
          yearId: year.id,
        },
      }),
      prisma.subject.create({
        data: {
          name: 'Chemistry',
          abbreviation: 'Chem',
          yearId: year.id,
        },
      }),
    ])

    if (year.id === years[0].id) {
      const teachers = await Promise.all([
        prisma.teacher.create({
          data: { name: 'John Smith', initials: 'JS' },
        }),
        prisma.teacher.create({
          data: { name: 'Jane Doe', initials: 'JD' },
        }),
        prisma.teacher.create({
          data: { name: 'Robert Wilson', initials: 'RW' },
        }),
        prisma.teacher.create({
          data: { name: 'Mary Johnson', initials: 'MJ' },
        }),
      ])

      for (const studentClass of classes) {
        await Promise.all([
          prisma.curriculum.create({
            data: {
              classesPerWeek: 4,
              studentClassId: studentClass.id,
              subjectId: subjects[0].id, // Math
              teacherId: teachers[0].id, // John Smith
              yearId: year.id,
            },
          }),
          prisma.curriculum.create({
            data: {
              classesPerWeek: 3,
              studentClassId: studentClass.id,
              subjectId: subjects[1].id, // English
              teacherId: teachers[1].id, // Jane Doe
              yearId: year.id,
            },
          }),
        ])
      }

      const curriculum = await prisma.curriculum.findFirst({
        where: { studentClassId: classes[0].id },
      })

      if (curriculum) {
        await Promise.all([
          prisma.timetableElement.create({
            data: {
              term: 1,
              day: 'Monday',
              period: 1,
              startTime: new Date('1970-01-01T08:00:00.000Z'),
              endTime: new Date('1970-01-01T08:45:00.000Z'),
              yearId: year.id,
              studentClassId: classes[0].id,
              curriculumId: curriculum.id,
              roomId: rooms[0].id,
            },
          }),
          prisma.timetableElement.create({
            data: {
              term: 1,
              day: 'Monday',
              period: 2,
              startTime: new Date('1970-01-01T09:00:00.000Z'),
              endTime: new Date('1970-01-01T09:45:00.000Z'),
              yearId: year.id,
              studentClassId: classes[0].id,
              curriculumId: curriculum.id,
              roomId: rooms[0].id,
            },
          }),
        ])
      }
    }
  }
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
