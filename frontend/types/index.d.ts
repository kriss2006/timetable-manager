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
    subjectTeacher: {
      subject: Subject
      teacher: Teacher
    }
    room: Room
    evenWeekSubjectTeacher?: {
      subject: Subject
      teacher: Teacher
    }
    evenWeekRoom?: Room
    group2SubjectTeacher?: {
      subject: Subject
      teacher: Teacher
    }
    group2Room?: Room
  }
}
