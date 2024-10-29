<template>
  <h1>Manage teachers</h1>
  <p v-for="teacher in teachers" :key="teacher.id">
    {{ teacher.name }} {{ teacher.initials }}
  </p>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()

const teachers = ref<Teacher[]>([])

onMounted(async () => {
  teachers.value = await store.fetchTeachers()
})
</script>
