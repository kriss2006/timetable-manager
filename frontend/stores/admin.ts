import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const selectedYearId = ref(0)
  const user = ref<User | null>(null)

  const loadFromLocalStorage = () => {
    if (import.meta.client) {
      selectedYearId.value = Number(localStorage.getItem('selectedYearId'))

      const token = localStorage.getItem('token')
      if (token) {
        user.value = tokenToUser(token)
      }
    }
  }

  const yearsLoading = ref(true)
  const fetchYears = async (): Promise<Year[]> => {
    return axios
      .get(`http://localhost:3001/api/years`)
      .then((response) => response.data)
      .catch(() => [])
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
        .catch(() => [])
        .finally(() => {
          roomsLoading.value = false
        })
    } else {
      return []
    }
  }

  const studentClassesLoading = ref(true)
  const fetchStudentClasses = async (
    currentYear?: string
  ): Promise<StudentClass[]> => {
    let yearId = selectedYearId.value
    if (currentYear) {
      yearId = await axios
        .get(`http://localhost:3001/api/years/${currentYear}`)
        .then((response) => response.data.id)
        .catch(() => selectedYearId.value)
    }

    if (yearId > 0) {
      return axios
        .get(`http://localhost:3001/api/student-classes/${yearId}`)
        .then((response) => response.data)
        .catch(() => [])
        .finally(() => {
          studentClassesLoading.value = false
        })
    } else {
      return []
    }
  }

  const subjectsLoading = ref(true)
  const fetchSubjects = async (): Promise<Subject[]> => {
    if (selectedYearId.value > 0) {
      return axios
        .get(`http://localhost:3001/api/subjects/${selectedYearId.value}`)
        .then((response) => response.data)
        .catch(() => [])
        .finally(() => {
          subjectsLoading.value = false
        })
    } else {
      return []
    }
  }

  const teachersLoading = ref(true)
  const fetchTeachers = async (): Promise<Teacher[]> => {
    return axios
      .get(`http://localhost:3001/api/teachers`)
      .then((response) => response.data)
      .catch(() => [])
      .finally(() => {
        teachersLoading.value = false
      })
  }

  const timetableElementsLoading = ref(true)
  const fetchTimetableElements = async (
    term: number | undefined,
    studentClassId: number | undefined,
    day: string,
    currentYear?: string
  ): Promise<TimetableElement[]> => {
    let yearId = selectedYearId.value
    if (currentYear) {
      yearId = await axios
        .get(`http://localhost:3001/api/years/${currentYear}`)
        .then((response) => response.data.id)
        .catch(() => selectedYearId.value)
    }

    if (yearId > 0 && term && studentClassId) {
      return axios
        .get<TimetableElement[]>(
          `http://localhost:3001/api/timetable-elements/${yearId}/${term}/${studentClassId}/${day}`
        )
        .then((response) =>
          response.data.map(({ startTime, endTime, ...rest }) => ({
            ...rest,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
          }))
        )
        .catch(() => [])
        .finally(() => {
          timetableElementsLoading.value = false
        })
    } else {
      return []
    }
  }

  const availableTimetableElementsLoading = ref(true)
  const fetchAvailableTimetableElements = async (
    studentClassId: number | undefined
  ): Promise<AvailableTimetableElement[]> => {
    if (selectedYearId.value > 0 && studentClassId) {
      return axios
        .get<AvailableTimetableElement[]>(
          `http://localhost:3001/api/available-timetable-elements/${selectedYearId.value}/${studentClassId}`
        )
        .then((response) => response.data)
        .catch(() => [])
        .finally(() => {
          availableTimetableElementsLoading.value = false
        })
    } else {
      return []
    }
  }

  watch(selectedYearId, () => {
    if (selectedYearId.value > 0 && import.meta.client) {
      localStorage.setItem('selectedYearId', String(selectedYearId.value))
    }
  })

  return {
    loadFromLocalStorage,
    user,
    selectedYearId,
    yearsLoading,
    fetchYears,
    roomsLoading,
    fetchRooms,
    studentClassesLoading,
    fetchStudentClasses,
    subjectsLoading,
    fetchSubjects,
    teachersLoading,
    fetchTeachers,
    timetableElementsLoading,
    fetchTimetableElements,
    availableTimetableElementsLoading,
    fetchAvailableTimetableElements,
  }
})
