export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const selectedYearTerm = Number(
      localStorage.getItem('selectedYearTerm') ?? 0
    )

    if (!token && to.path !== '/login') {
      return navigateTo('/login')
    }

    if (to.path !== '/admin/dashboard' && selectedYearTerm === 0) {
      return navigateTo('/admin/dashboard')
    }
  }
})
