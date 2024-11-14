import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const selectedYear = ref(0)

  const getFromLocalStorage = () => {
    selectedYear.value = import.meta.client
      ? Number(localStorage.getItem('selectedYear') ?? 0)
      : 0
  }

  const fetchYears = async (): Promise<Year[] | void> => {
    try {
      const response = await axios.get('http://localhost:3001/api/years')
      return response.data
    } catch (err) {
      console.error(err)
    }
  }

  const fetchRooms = async (): Promise<Room[]> => {
    if (selectedYear.value > 0) {
      return axios
        .get(`http://localhost:3001/api/rooms/${selectedYear.value}`)
        .then((response) => response.data)
        .catch((err) => {
          console.error(err)
          return []
        })
    } else {
      return []
    }
  }

  const fetchClasses = async (): Promise<Class[]> => {
    if (selectedYear.value > 0) {
      return axios
        .get(`http://localhost:3001/api/classes/${selectedYear.value}`)
        .then((response) => response.data)
        .catch((err) => {
          console.error(err)
          return []
        })
    } else {
      return []
    }
  }

  const fetchTeachers = async (): Promise<Teacher[]> => {
    if (selectedYear.value > 0) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/teachers/${selectedYear.value}`
        )
        return response.data
      } catch (err) {
        console.error(err)
        return []
      }
    } else {
      return []
    }
  }

  watch(selectedYear, () => {
    if (selectedYear.value > 0 && import.meta.client) {
      localStorage.setItem('selectedYear', String(selectedYear.value))
    }
  })

  return {
    getFromLocalStorage,
    selectedYear,
    fetchYears,
    fetchRooms,
    fetchClasses,
    fetchTeachers,
  }
})
