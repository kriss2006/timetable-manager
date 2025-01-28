<template>
  <div
    class="border-2 p-2 my-1 rounded-lg text-center"
    :class="{ 'border-yellow-500': warningMessage, 'cursor-move': admin }"
  >
    <h1 class="text-lg">{{ element.period }}.</h1>
    <p>
      {{ dateToTimeString(element.startTime) }} -
      {{ dateToTimeString(element.endTime) }}
    </p>
    <p>
      {{
        element.curriculum.subject.abbreviation ??
        element.curriculum.subject.name
      }}
    </p>
    <p>
      {{
        element.curriculum.teacher.initials ?? element.curriculum.teacher.name
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
    <p
      v-if="warningMessage"
      class="text-yellow-500 mt-2 break-words whitespace-normal"
    >
      {{ warningMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  element: TimetableElement
  admin: boolean
  warnings?: { id: number; message: string }[]
  onEdit?: (element: TimetableElement) => void
  onRemove?: (element: TimetableElement) => void
}>()

const warningMessage = computed(() => {
  const warning = props.warnings?.find(
    (warning) => warning.id === props.element.id
  )
  return warning ? warning.message : null
})
</script>
