export {}

declare global {
  interface User {
    id: number
    name: string
    username: string
    type: 'student' | 'teacher' | 'admin' | 'super_admin'
  }

  interface Year {
    id: number
    name: string
  }

  // All of the table types are for the import format
  interface TableYear {
    Name: string
  }

  // For a year
  interface Room {
    id: number
    name: string
  }

  interface TableRoom {
    Name: string
  }

  // For a year
  interface StudentClass {
    id: number
    name: string
  }

  interface TableStudentClass {
    Name: string
  }

  // For a year
  interface Subject {
    id: number
    name: string
    abbreviation?: string
  }

  interface TableSubject {
    Name: string
    Abbreviation?: string
  }

  interface Teacher {
    id: number
    name: string
    initials: string
  }

  interface TableTeacher {
    Name: string
    Initials: string
  }

  // For a year and a student class
  interface Curriculum {
    id: number
    classesPerWeek: number
    subject: Subject
    teacher: Teacher
  }

  // For a year, a term, a student class (and a day)
  interface TimetableElement {
    id: number
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
    period: number
    startTime: Date
    endTime: Date
    curriculum: {
      id: number
      subject: Subject
      teacher: Teacher
    }
    room: Room
  }

  interface ModalData {
    open: boolean
    errorMessage: string
    id: number
    input: Record<string, number | string | Date>
    select?: {
      room?: Room
      subject?: Subject
      teacher?: Teacher
      type?: 'student' | 'teacher' | 'admin' | 'super_admin'
    }
  }

  interface RemoveModalData {
    open: boolean
    errorMessage: string
    id: number
    name: string
  }

  interface Timetable {
    monday: TimetableElement[]
    tuesday: TimetableElement[]
    wednesday: TimetableElement[]
    thursday: TimetableElement[]
    friday: TimetableElement[]
    available: Curriculum[]
  }
}
