<template>
  <h1>Manage classes</h1>
  <p v-for="classs in classes">{{ classs.number }}{{ classs.letter }}</p>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()

const classes = ref<Class[]>([])

onMounted(async () => {
  const resultClasses = await store.fetchClasses()
  if (resultClasses) {
    classes.value = resultClasses
  }
})
</script>
