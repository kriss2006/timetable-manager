import axios, { AxiosError } from 'axios'

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

  const modalError = ref<null | string>(null)

  const handleEdit = async (type: string, row: YearTerm | Class | Teacher) => {
    console.warn('Type: ', type, 'Row: ', row)
    switch (type) {
      case 'yearTerm':
        console.log('Edit year term', row)
        break

      case 'class':
        row = row as Class
        await axios
          .patch(`http://localhost:3001/api/classes/${row.id}`, {
            name: row.name,
          })
          .catch((error) => {
            if (error.response) {
              modalError.value = error.response.data.error
              // console.error(error.response.data)
              // console.error(error.response.status)
              // console.error(error.response.headers)
            } else if (error.request) {
              // console.error(error.request)
            } else {
              // console.error('Error', error.message)
            }
            // console.error(error.config)
          })
        break

      case 'teacher':
        console.log('Edit teacher', row)
        break

      default:
        return
    }
  }

  const handleRemove = (type: string, row: YearTerm | Class | Teacher) => {
    switch (type) {
      case 'yearTerm':
        console.log('Edit year term', row)
        break

      case 'class':
        console.log('Edit class', row)
        break

      case 'teacher':
        console.log('Edit teacher', row)
        break

      default:
        return
    }
  }

  return {
    getFromLocalStorage,
    selectedYearTerm,
    fetchYearTerms,
    fetchClasses,
    fetchTeachers,
    modalError,
    handleEdit,
    handleRemove,
  }
})
