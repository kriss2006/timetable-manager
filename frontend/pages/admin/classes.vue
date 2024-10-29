<template>
  <h1>Manage classes</h1>
  <p v-for="classs in classes" :key="classs.id">{{ classs.name }}</p>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()

const classes = ref<Class[]>([])

onMounted(async () => {
  classes.value = await store.fetchClasses()
})
</script>
