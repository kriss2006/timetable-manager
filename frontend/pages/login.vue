<template>
  <div class="flex flex-col items-center my-2 gap-4">
    <UButton v-if="user" size="lg" color="red" variant="soft" @click="logout"
      >Logout
    </UButton>

    <div v-else class="flex items-center my-6 gap-12">
      <form
        @submit.prevent="login"
        class="flex flex-col items-center my-2 gap-4"
      >
        <UInput type="text" v-model="username" placeholder="Username" />
        <UInput type="password" v-model="password" placeholder="Password" />
        <UButton type="submit" color="blue" variant="soft">Login</UButton>
        <p v-if="loginErrorMessage" class="text-red-500">
          {{ loginErrorMessage }}
        </p>
      </form>
      <h1>Or</h1>
      <div class="flex flex-col items-center my-2 gap-4">
        <GoogleSignInButton
          @success="googleLoginSuccess"
          @error="googleLoginError"
        />
        <p v-if="googleLoginErrorMessage" class="text-red-500">
          {{ googleLoginErrorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const store = useAdminStore()
const { user } = storeToRefs(store)

const username = ref('')
const password = ref('')
const loginErrorMessage = ref('')
const googleLoginErrorMessage = ref('')

const login = () => {
  axios
    .post('http://localhost:3001/api/login', {
      username: username.value,
      password: password.value,
    })
    .then((response) => {
      setToken(response.data.token)
      if (user.value.type === 'student') {
        navigateTo('/')
      } else {
        navigateTo('/admin/dashboard')
      }
    })
    .catch((err) => {
      loginErrorMessage.value = err.response.data.message
    })
}

const googleLoginSuccess = (response) => {
  const { credential } = response

  axios
    .post('http://localhost:3001/api/google-login', {
      token: credential,
    })
    .then((response) => {
      setToken(response.data.token)
      if (user.value.type === 'student') {
        navigateTo('/')
      } else {
        navigateTo('/admin/dashboard')
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const googleLoginError = () => {
  loginErrorMessage.value = 'Login failed'
}

const setToken = (token) => {
  if (import.meta.client) {
    localStorage.setItem('token', token)
    const decodedToken = jwtDecode(token)

    user.value = {
      id: decodedToken.user.id,
      name: decodedToken.user.name,
      username: decodedToken.user.username,
      type: decodedToken.user.type,
    }
  }
}

const logout = () => {
  if (import.meta.client) {
    localStorage.removeItem('token')
    user.value = null
    navigateTo('/')
  }
}
</script>
