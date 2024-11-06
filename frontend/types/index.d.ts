export {}

declare global {
  interface Year {
    id: number
    name: string
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
