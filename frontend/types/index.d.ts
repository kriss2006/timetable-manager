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

  // For a year
  interface Room {
    id: number
    name: string
  }

  // For a year
  interface StudentClass {
    id: number
    name: string
  }

  // For a year
  interface Subject {
    id: number
    name: string
    abbreviation?: string
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
    alternating: boolean
    split: boolean
    studentClassSubjectTeacher: {
      id: number
      subject: Subject
      teacher: Teacher
    }
    room: Room
    evenWeekStudentClassSubjectTeacher?: {
      id: number
      subject: Subject
      teacher: Teacher
    }
    evenWeekRoom?: Room
    group2StudentClassSubjectTeacher?: {
      id: number
      subject: Subject
      teacher: Teacher
    }
    group2Room?: Room
  }

  // For a year and a class
  interface AvailableTimetableElement {
    id: number
    classesPerWeek: number
    subject: Subject
    teacher: Teacher
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
    available: AvailableTimetableElement[]
  }

  // enum UserType {
  //   student = 'student',
  //   teacher = 'teacher',
  //   admin = 'admin',
  //   super_admin = 'superAdmin',
  // }
}
