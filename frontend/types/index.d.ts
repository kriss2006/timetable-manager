export {}

declare global {
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

  // For a year, a term, a student class and a day
  interface TimetableElement {
    id: number
    period: number
    startTime: Date
    endTime: Date
    alternating: boolean
    split: boolean
    studentClassSubjectTeacher: {
      subject: Subject
      teacher: Teacher
    }
    room: Room
    evenWeekStudentClassSubjectTeacher?: {
      subject: Subject
      teacher: Teacher
    }
    evenWeekRoom?: Room
    group2StudentClassSubjectTeacher?: {
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

  // enum UserType {
  //   student = 'student',
  //   teacher = 'teacher',
  //   admin = 'admin',
  //   super_admin = 'superAdmin',
  // }

  // enum Day {
  //   Monday = 'Monday',
  //   Tuesday = 'Tuesday',
  //   Wednesday = 'Wednesday',
  //   Thursday = 'Thursday',
  //   Friday = 'Friday',
  // }
}
