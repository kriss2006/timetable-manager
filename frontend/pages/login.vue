<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const username = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  try {
    const response = await axios.post("http://localhost:3001/api/login", {
      username: username.value,
      password: password.value,
    });

    if (import.meta.client) {
      localStorage.setItem("token", response.data.token);
      const decodedToken = jwtDecode(response.data.token);

      localStorage.setItem("userData", {
        id: decodedToken.id,
        username: decodedToken.username,
        permissionLevel: decodedToken.permissionLevel,
      });
    }

    navigateTo("/dashboard");
  } catch (err) {
    error.value = err.response.data.message || "An error occurred";
  }
};
</script>
