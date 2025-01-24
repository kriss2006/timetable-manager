<template>
  <div class="flex flex-col items-center my-2 gap-4">
    <UButton v-if="user" size="lg" color="red" variant="soft" @click="logOut"
      >Log out
    </UButton>
    <div
      v-else-if="logInOrSignUp"
      class="flex flex-col items-center my-2 gap-4"
    >
      <div class="flex items-center my-6 gap-12">
        <form
          @submit.prevent="logIn"
          class="flex flex-col items-center my-2 gap-4"
        >
          <UInput type="text" v-model="username" placeholder="Username" />
          <UInput type="password" v-model="password" placeholder="Password" />
          <UButton type="submit" color="blue" variant="soft">Log in</UButton>
          <p v-if="errorMessage" class="text-red-500">
            {{ errorMessage }}
          </p>
        </form>
        <h1>Or</h1>
        <div class="flex flex-col items-center my-2 gap-4">
          <GoogleSignInButton
            @success="googleLoginSuccess"
            @error="googleLoginError"
          />
          <p v-if="googleErrorMessage" class="text-red-500">
            {{ googleErrorMessage }}
          </p>
        </div>
      </div>
      <p>
        Don't have an account?
        <span
          class="text-blue-500 cursor-pointer hover:underline"
          @click="switchMode"
          >Sign up</span
        >
      </p>
    </div>
    <div v-else class="flex flex-col items-center my-2 gap-4">
      <form
        @submit.prevent="signUp"
        class="flex flex-col items-center my-2 gap-4"
      >
        <UInput type="text" v-model="name" placeholder="Name" />
        <UInput type="text" v-model="username" placeholder="Username" />
        <UInput type="password" v-model="password" placeholder="Password" />
        <UInput
          type="password"
          v-model="repeatPassword"
          placeholder="Repeat password"
        />
        <UButton type="submit" color="blue" variant="soft">Sign up</UButton>
        <p v-if="errorMessage" class="text-red-500">
          {{ errorMessage }}
        </p>
      </form>
      <p>
        Already have an account?
        <span
          class="text-blue-500 cursor-pointer hover:underline"
          @click="switchMode"
          >Log in</span
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'

const store = useAdminStore()
const { user } = storeToRefs(store)

const logInOrSignUp = ref(true)

const name = ref('')
const username = ref('')
const password = ref('')
const repeatPassword = ref('')

const errorMessage = ref('')
const googleErrorMessage = ref('')

const switchMode = () => {
  logInOrSignUp.value = !logInOrSignUp.value

  name.value = ''
  username.value = ''
  password.value = ''
  repeatPassword.value = ''

  errorMessage.value = ''
  googleErrorMessage.value = ''
}

const logIn = () => {
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
      errorMessage.value = err.response.data.message
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
    .catch((err) => {
      googleErrorMessage.value = err
    })
}

const googleLoginError = () => {
  googleErrorMessage.value = 'Login failed'
}

const setToken = (token) => {
  if (import.meta.client) {
    localStorage.setItem('token', token)
    user.value = tokenToUser(token)
  }
}

const logOut = () => {
  if (import.meta.client) {
    localStorage.removeItem('token')
    user.value = null
    navigateTo('/')
  }
}

const signUp = () => {
  if (password.value !== repeatPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }
  axios
    .post('http://localhost:3001/api/signup', {
      name: name.value,
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
      errorMessage.value = err.response.data.message
    })
}
</script>
