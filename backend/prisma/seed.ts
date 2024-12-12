import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create users
  await prisma.user.create({
    data: {
      name: 'Admin User',
      username: 'admin',
      passwordHash: await bcrypt.hash('admin123', 10),
      type: 'admin',
    },
  })

  await prisma.user.create({
    data: {
      name: 'Teacher User',
      username: 'teacher',
      passwordHash: await bcrypt.hash('teacher123', 10),
      type: 'teacher',
    },
  })

  // Create years
  const year1 = await prisma.year.create({
    data: { name: '2024/2025' },
  })

  await prisma.year.create({
    data: { name: '2023/2024' },
  })

  await prisma.year.create({
    data: { name: '2022/2023' },
  })

  await prisma.year.create({
    data: { name: '2021/2022' },
  })

  await prisma.year.create({
    data: { name: '2020/2021' },
  })

  // Create Rooms
  const room1 = await prisma.room.create({
    data: { name: 'Room 1', yearId: year1.id },
  })

  const room2 = await prisma.room.create({
    data: { name: 'Room 2', yearId: year1.id },
  })

  const room3 = await prisma.room.create({
    data: { name: 'Room 3', yearId: year1.id },
  })

  const room4 = await prisma.room.create({
    data: { name: 'Room 4', yearId: year1.id },
  })

  const room5 = await prisma.room.create({
    data: { name: 'Room 5', yearId: year1.id },
  })

  // Create student classes
  const studentClass1 = await prisma.studentClass.create({
    data: { name: '1A', yearId: year1.id },
  })

  const studentClass2 = await prisma.studentClass.create({
    data: { name: '1B', yearId: year1.id },
  })

  await prisma.studentClass.create({
    data: { name: '1C', yearId: year1.id },
  })

  await prisma.studentClass.create({
    data: { name: '1D', yearId: year1.id },
  })

  await prisma.studentClass.create({
    data: { name: '1E', yearId: year1.id },
  })

  // Create subjects
  const subject1 = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      abbreviation: 'Math',
      yearId: year1.id,
    },
  })

  const subject2 = await prisma.subject.create({
    data: {
      name: 'Science',
      yearId: year1.id,
    },
  })

  const subject3 = await prisma.subject.create({
    data: {
      name: 'Literature',
      abbreviation: 'Lit',
      yearId: year1.id,
    },
  })

  const subject4 = await prisma.subject.create({
    data: {
      name: 'Geography',
      yearId: year1.id,
    },
  })

  const subject5 = await prisma.subject.create({
    data: {
      name: 'Chemistry',
      yearId: year1.id,
    },
  })

  // Create teachers
  const teacher1 = await prisma.teacher.create({
    data: { name: 'John Doe', initials: 'JD' },
  })

  const teacher2 = await prisma.teacher.create({
    data: { name: 'Jane Smith', initials: 'JS' },
  })

  // Assign student classes to subjects to teachers
  const studentClassSubjectTeacher1 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 4,
        studentClassId: studentClass1.id,
        subjectId: subject1.id,
        teacherId: teacher1.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher2 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 6,
        studentClassId: studentClass1.id,
        subjectId: subject2.id,
        teacherId: teacher2.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher3 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 2,
        studentClassId: studentClass1.id,
        subjectId: subject3.id,
        teacherId: teacher1.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher4 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 2,
        studentClassId: studentClass1.id,
        subjectId: subject4.id,
        teacherId: teacher2.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher5 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 2,
        studentClassId: studentClass1.id,
        subjectId: subject5.id,
        teacherId: teacher2.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher6 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 4,
        studentClassId: studentClass2.id,
        subjectId: subject1.id,
        teacherId: teacher1.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher7 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 6,
        studentClassId: studentClass2.id,
        subjectId: subject2.id,
        teacherId: teacher2.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher8 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 2,
        studentClassId: studentClass2.id,
        subjectId: subject3.id,
        teacherId: teacher1.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher9 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 2,
        studentClassId: studentClass2.id,
        subjectId: subject4.id,
        teacherId: teacher2.id,
        yearId: year1.id,
      },
    })

  const studentClassSubjectTeacher10 =
    await prisma.studentClassSubjectTeacher.create({
      data: {
        classesPerWeek: 2,
        studentClassId: studentClass2.id,
        subjectId: subject5.id,
        teacherId: teacher2.id,
        yearId: year1.id,
      },
    })

  // Create timetable elements
  await prisma.timetableElement.create({
    data: {
      term: 1,
      period: 1,
      day: 'Monday',
      startTime: '1970-01-01T08:00:00.000Z',
      endTime: '1970-01-01T08:40:00.000Z',
      alternating: false,
      split: false,
      yearId: 1,
      studentClassId: studentClass1.id,
      studentClassSubjectTeacherId: studentClassSubjectTeacher1.id,
      roomId: room1.id,
    },
  })

  await prisma.timetableElement.create({
    data: {
      term: 1,
      period: 2,
      day: 'Monday',
      startTime: '1970-01-01T08:40:00.000Z',
      endTime: '1970-01-01T09:20:00.000Z',
      alternating: false,
      split: false,
      yearId: 1,
      studentClassId: studentClass1.id,
      studentClassSubjectTeacherId: studentClassSubjectTeacher1.id,
      roomId: room1.id,
    },
  })

  await prisma.timetableElement.create({
    data: {
      term: 1,
      period: 3,
      day: 'Monday',
      startTime: '1970-01-01T09:30:00.000Z',
      endTime: '1970-01-01T10:10:00.000Z',
      alternating: false,
      split: false,
      yearId: 1,
      studentClassId: studentClass1.id,
      studentClassSubjectTeacherId: studentClassSubjectTeacher2.id,
      roomId: room1.id,
    },
  })

  await prisma.timetableElement.create({
    data: {
      term: 1,
      period: 4,
      day: 'Monday',
      startTime: '1970-01-01T10:10:00.000Z',
      endTime: '1970-01-01T10:50:00.000Z',
      alternating: false,
      split: false,
      yearId: 1,
      studentClassId: studentClass1.id,
      studentClassSubjectTeacherId: studentClassSubjectTeacher2.id,
      roomId: room1.id,
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
