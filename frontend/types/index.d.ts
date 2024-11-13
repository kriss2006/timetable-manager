export {}

declare global {
  interface Year {
    id: number
    name: string
  }

  interface Room {
    id: number
    name: string
    type: string
  }

  interface Class {
    id: number
    name: string
  }

  interface Subject {
    id: number
    name: number
    type: string
    teachers: Teacher[]
  }

  interface Teacher {
    id: number
    name: string
    initials: string
    subjects: Subject[]
  }
}
