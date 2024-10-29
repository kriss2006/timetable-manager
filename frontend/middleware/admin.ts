// export default defineNuxtRouteMiddleware(() => {
//   if (!(import.meta.client && localStorage.getItem('token'))) {
//     return navigateTo('/login')
//   } else if (
//     !localStorage.getItem('selectedYearTerm') ||
//     Number(localStorage.getItem('selectedYearTerm')) === 0
//   ) {
//     return navigateTo('/admin/dashboard')
//   }
// })

// export default defineNuxtRouteMiddleware((to) => {
//   if (import.meta.client) {
//     if (!localStorage.getItem('token')) {
//       return navigateTo('/login')
//     } else if (
//       useRoute().path !== '/admin/dashboard' &&
//       (!localStorage.getItem('selectedYearTerm') ||
//         Number(localStorage.getItem('selectedYearTerm')) === 0)
//     ) {
//       return navigateTo('/admin/dashboard')
//     }
//   }
// })

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    const selectedYearTerm = Number(
      localStorage.getItem('selectedYearTerm') ?? 0
    )

    // Redirect to login if no token is found and we're not already on /login
    if (!token && to.path !== '/login') {
      return navigateTo('/login')
    }

    // Redirect to dashboard if selectedYearTerm is missing or zero and we're not on /admin/dashboard
    if (to.path !== '/admin/dashboard' && selectedYearTerm === 0) {
      return navigateTo('/admin/dashboard')
    }
  }
})
