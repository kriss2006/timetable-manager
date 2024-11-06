export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const selectedYear = Number(localStorage.getItem('selectedYear') ?? 0)

    if (!token && to.path !== '/login') {
      return navigateTo('/login')
    }

    if (to.path !== '/admin/dashboard' && selectedYear === 0) {
      return navigateTo('/admin/dashboard')
    }
  }
})
