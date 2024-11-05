import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const selectedYearTerm = ref(0)

  const getFromLocalStorage = () => {
    selectedYearTerm.value = import.meta.client
      ? Number(localStorage.getItem('selectedYearTerm') ?? 0)
      : 0
  }

  const fetchYearTerms = async (): Promise<YearTerm[] | void> => {
    try {
      const response = await axios.get('http://localhost:3001/api/year-terms')
      return response.data
    } catch (err) {
      console.error(err)
    }
  }

  const fetchClasses = async (): Promise<Class[]> => {
    if (selectedYearTerm.value > 0) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/classes/${selectedYearTerm.value}`
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

  const fetchTeachers = async (): Promise<Teacher[]> => {
    if (selectedYearTerm.value > 0) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/teachers/${selectedYearTerm.value}`
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

  watch(selectedYearTerm, () => {
    if (selectedYearTerm.value > 0 && import.meta.client) {
      localStorage.setItem('selectedYearTerm', String(selectedYearTerm.value))
    }
  })

  return {
    getFromLocalStorage,
    selectedYearTerm,
    fetchYearTerms,
    fetchClasses,
    fetchTeachers,
  }
})
