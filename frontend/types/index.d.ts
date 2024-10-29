export {}

declare global {
  interface YearTerm {
    id: number
    year: string
    term: number
  }

  interface Class {
    id: number
    name: string
  }

  interface Teacher {
    id: number
    name: string
    initials: string
  }
}
