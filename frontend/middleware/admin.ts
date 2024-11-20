export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const selectedYearId = Number(localStorage.getItem('selectedYearId') ?? 0)

    if (!token && to.path !== '/login') {
      return navigateTo('/login')
    }

    if (to.path !== '/admin/dashboard' && selectedYearId === 0) {
      return navigateTo('/admin/dashboard')
    }
  }
})
