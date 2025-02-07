import { jwtDecode } from 'jwt-decode'

export const tokenToUser = (token: string) => {
  const decoded = jwtDecode<{ user: User }>(token)
  return decoded.user
}
export const dateToTimeString = (date: Date) => date.toISOString().slice(11, 16)

export const timeStringToDate = (timeString: string) =>
  new Date(`1970-01-01T${timeString}:00.000Z`)

export const isTimeString = (timeString: string) =>
  /^[0-2]\d:[0-5]\d$/.test(timeString)

export const compareTimetables = (
  oldTimetable: Timetable,
  newTimetable: Timetable
) => {
  const getFlattenedTimetable = (timetable: Timetable) => {
    return [
      ...timetable.monday,
      ...timetable.tuesday,
      ...timetable.wednesday,
      ...timetable.thursday,
      ...timetable.friday,
    ]
  }

  const oldArray = getFlattenedTimetable(oldTimetable)
  const newArray = getFlattenedTimetable(newTimetable)

  const oldMap = new Map(oldArray.map((item) => [item.id, item]))
  const newMap = new Map(newArray.map((item) => [item.id, item]))

  const added = newArray.filter((item) => !oldMap.has(item.id))
  const deleted = oldArray.filter((item) => !newMap.has(item.id))

  const modified: TimetableElement[] = []

  newArray.forEach((item) => {
    if (oldMap.has(item.id)) {
      const oldItem = oldMap.get(item.id)!
      if (JSON.stringify(oldItem) !== JSON.stringify(item)) {
        modified.push(item)
      }
    }
  })

  const oldAvailable = oldTimetable.available
  const newAvailable = newTimetable.available

  const availableModified: Curriculum[] = []

  newAvailable.forEach((item) => {
    const oldItem = oldAvailable.find((oldElem) => oldElem.id === item.id)
    if (oldItem && oldItem.classesPerWeek !== item.classesPerWeek) {
      availableModified.push(item)
    }
  })

  return { added, modified, deleted, availableModified }
}
