import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const selectedYearId = ref(0)

  const getFromLocalStorage = () => {
    selectedYearId.value = import.meta.client
      ? Number(localStorage.getItem('selectedYearId') ?? 0)
      : 0
  }

  const yearsLoading = ref(true)
  const fetchYears = async (): Promise<Year[]> => {
    return axios
      .get(`http://localhost:3001/api/years`)
      .then((response) => response.data)
      .catch((err) => {
        console.error(err)
        return []
      })
      .finally(() => {
        yearsLoading.value = false
      })
  }

  const roomsLoading = ref(true)
  const fetchRooms = async (): Promise<Room[]> => {
    if (selectedYearId.value > 0) {
      return axios
        .get(`http://localhost:3001/api/rooms/${selectedYearId.value}`)
        .then((response) => response.data)
        .catch((err) => {
          console.error(err)
          return []
        })
        .finally(() => {
          roomsLoading.value = false
        })
    } else {
      return []
    }
  }

  const studentClassesLoading = ref(true)
  const fetchStudentClasses = async (): Promise<StudentClass[]> => {
    if (selectedYearId.value > 0) {
      return axios
        .get(
          `http://localhost:3001/api/student-classes/${selectedYearId.value}`
        )
        .then((response) => response.data)
        .catch((err) => {
          console.error(err)
          return []
        })
        .finally(() => {
          studentClassesLoading.value = false
        })
    } else {
      return []
    }
  }

  const timetableElementsLoading = ref(true)
  const fetchTimetableElements = async (
    term: number | undefined,
    studentClassId: number | undefined,
    day: string
  ): Promise<TimetableElement[]> => {
    if (selectedYearId.value > 0 && term && studentClassId) {
      return axios
        .get<TimetableElement[]>(
          `http://localhost:3001/api/timetable-elements/${selectedYearId.value}/${term}/${studentClassId}/${day}`
        )
        .then((response) =>
          response.data.map(({ startTime, endTime, ...rest }) => ({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
          }))
        )
        .catch((err) => {
          console.error(err)
          return []
        })
        .finally(() => {
          timetableElementsLoading.value = false
        })
    } else {
      return []
    }
  }

  // const fetchTeachers = async (): Promise<Teacher[]> => {
  //   if (selectedYearId.value > 0) {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3001/api/teachers/${selectedYearId.value}`
  //       )
  //       return response.data
  //     } catch (err) {
  //       console.error(err)
  //       return []
  //     }
  //   } else {
  //     return []
  //   }
  // }

  watch(selectedYearId, () => {
    if (selectedYearId.value > 0 && import.meta.client) {
      localStorage.setItem('selectedYearId', String(selectedYearId.value))
    }
  })

  return {
    getFromLocalStorage,
    selectedYearId,
    yearsLoading,
    fetchYears,
    roomsLoading,
    fetchRooms,
    studentClassesLoading,
    fetchStudentClasses,
    timetableElementsLoading,
    fetchTimetableElements,
  }
})
