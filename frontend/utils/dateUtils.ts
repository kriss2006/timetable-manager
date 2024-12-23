export const dateToTimeString = (date: Date) => date.toISOString().slice(11, 16)

export const timeStringToDate = (timeString: string) =>
  new Date(`1970-01-01T${timeString}:00.000Z`)

export const isTimeString = (timeString: string) =>
  /^[0-2]\d:[0-5]\d$/.test(timeString)
