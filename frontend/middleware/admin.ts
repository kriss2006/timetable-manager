export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    if (!localStorage.getItem('token')) {
      return navigateTo('/login')
    }
  }
})
