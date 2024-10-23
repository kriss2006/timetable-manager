import axios from 'axios'

interface YearTerm {
  id: number
  year: string
  term: number
}

export const useAdminStore = defineStore('admin', () => {
  const selectedYearTerm = ref(0)
  const yearTerms = ref<YearTerm[]>([])

  const fetchYearTerms = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/year-terms')
      yearTerms.value = response.data
    } catch (err) {
      console.error(err)
    }
  }

  return {
    selectedYearTerm,
    yearTerms,
    fetchYearTerms,
  }
})
