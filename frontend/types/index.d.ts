export {}

declare global {
  interface Year {
    id: number
    name: string
  }

  // For an year
  interface Room {
    id: number
    name: string
  }

  // For an year
  interface StudentClass {
    id: number
    name: string
  }

  // For a year
  interface Subject {
    id: number
    name: number
    abbreviation: string
    teachers: Teacher[]
  }

  interface Teacher {
    id: number
    name: string
    initials: string
    subjects: Subject[]
  }

  // For a year, term, student class and day
  interface TimetableElement {
    id: number
    period: number
    startTime: Date
    endTime: Date
    alternating: boolean
    split: boolean
    subject: Subject
    teacher: Teacher
    room: Room
    evenWeekSubject?: Subject
    evenWeekTeacher?: Teacher
    evenWeekRoom?: Room
    week2Subject?: Subject
    week2Teacher?: Teacher
    week2Room?: Room
  }
}
