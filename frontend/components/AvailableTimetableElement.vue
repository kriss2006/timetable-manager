<template>
  <div
    class="border-2 p-2 my-1 rounded-lg text-center cursor-move"
    :class="{ 'border-green-500': element.classesPerWeek === 0 }"
  >
    <h1 class="text-lg">{{ element.subject.name }}</h1>
    <p>
      {{ element.teacher.name }}
    </p>
    <p>Classes per week: {{ element.classesPerWeek }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  element: Curriculum
}>()
</script>
