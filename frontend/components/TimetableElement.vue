<template>
  <div class="border-2 p-2 my-1 rounded-lg text-center">
    <h1 class="text-lg">{{ timetableElement.period }}.</h1>
    <p>
      {{ timetableElement.startTime.toISOString().slice(11, 16) }} -
      {{ timetableElement.endTime.toISOString().slice(11, 16) }}
    </p>
    <p>
      {{
        timetableElement.studentClassSubjectTeacher.subject.abbreviation ??
        timetableElement.studentClassSubjectTeacher.subject.name
      }}
    </p>
    <p>
      {{
        timetableElement.studentClassSubjectTeacher.teacher.initials ??
        timetableElement.studentClassSubjectTeacher.teacher.name
      }}
    </p>
    <p>{{ timetableElement.room.name }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  timetableElement: TimetableElement
}>()
</script>
