<template>
  <div class="border-2 p-2 rounded-lg text-center">
    <h1 class="text-lg">{{ timetableElement.period }}.</h1>
    <p>
      {{ timetableElement.startTime.toTimeString().slice(0, 5) }} -
      {{ timetableElement.endTime.toTimeString().slice(0, 5) }}
    </p>
    <p>
      {{
        timetableElement.subject.abbreviation ?? timetableElement.subject.name
      }}
    </p>
    <p>
      {{ timetableElement.teacher.initials ?? timetableElement.teacher.name }}
    </p>
    <p>{{ timetableElement.room.name }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  timetableElement: TimetableElement
}>()
</script>
