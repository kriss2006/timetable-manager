<template>
  <div
    class="border-2 p-2 my-1 rounded-lg text-center cursor-move"
    :class="{ 'border-red-500': isNaN(element.id) }"
  >
    <h1 class="text-lg">{{ element.period }}.</h1>
    <p>
      {{ element.startTime.toISOString().slice(11, 16) }} -
      {{ element.endTime.toISOString().slice(11, 16) }}
    </p>
    <p>
      {{
        element.studentClassSubjectTeacher.subject.abbreviation ??
        element.studentClassSubjectTeacher.subject.name
      }}
    </p>
    <p>
      {{
        element.studentClassSubjectTeacher.teacher.initials ??
        element.studentClassSubjectTeacher.teacher.name
      }}
    </p>
    <p>{{ element.room.name }}</p>
    <UButton color="blue" variant="soft" @click="onEdit(element)" class="m-1">
      Edit
    </UButton>
    <UButton color="red" variant="soft" @click="onRemove(element)" class="m-1">
      Remove
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  element: TimetableElement
  onEdit: (element: TimetableElement) => void
  onRemove: (element: TimetableElement) => void
}>()
</script>
