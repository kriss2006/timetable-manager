export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const user = token ? tokenToUser(token) : null

    if (user) {
      if (user.type === 'student') {
        return navigateTo('/')
      }
    } else {
      return navigateTo('/')
    }
  }
})
