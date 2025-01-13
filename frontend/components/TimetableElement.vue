<template>
  <div
    class="border-2 p-2 my-1 rounded-lg text-center"
    :class="{ 'border-yellow-500': isWarning(), 'cursor-move': admin }"
  >
    <h1 class="text-lg">{{ element.period }}.</h1>
    <p>
      {{ dateToTimeString(element.startTime) }} -
      {{ dateToTimeString(element.endTime) }}
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
    <UButton
      v-if="admin"
      color="blue"
      variant="soft"
      @click="onEdit(element)"
      class="m-1"
    >
      Edit
    </UButton>
    <UButton
      v-if="admin"
      color="red"
      variant="soft"
      @click="onRemove(element)"
      class="m-1"
    >
      Remove
    </UButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  element: TimetableElement
  admin: boolean
  onEdit?: (element: TimetableElement) => void
  onRemove?: (element: TimetableElement) => void
}>()

const isWarning = () => {
  return (
    props.element.startTime === props.element.endTime ||
    isNaN(props.element.room.id)
  )
}
</script>
