<template>
  <USelectMenu
    :loading="classesLoading"
    searchable
    v-model="selectedClassId"
    :options="classes"
    placeholder="Select a class"
    value-attribute="id"
    option-attribute="name"
    class="w-48"
  />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
})

const store = useAdminStore()

const { classesLoading } = storeToRefs(store)

const classes = ref<Class[]>([])

onMounted(async () => {
  classes.value = await store.fetchClasses()
})

const selectedClassId = ref<number>()
</script>
