<template>
  <div class="timetable-element">
    <div class="period-number">{{ timetableElement.period }}</div>
    <div class="time">
      {{ timetableElement.startTime.toTimeString().slice(0, 5) }} -
      {{ timetableElement.endTime.toTimeString().slice(0, 5) }}
    </div>
    <div class="subject">{{ timetableElement.subject.name }}</div>
    <div class="teacher">{{ timetableElement.teacher.name }}</div>
    <div class="room">{{ timetableElement.room.name }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  timetableElement: TimetableElement
}>()
</script>

<style scoped>
.timetable-element {
  border: 2px solid green;
  padding: 8px;
  margin: 4px;
  border-radius: 8px;
  text-align: center;
  background-color: #000;
  color: #0f0;
}
.period-number {
  font-weight: bold;
  font-size: 1.2rem;
}
.time,
.subject,
.teacher,
.room {
  font-size: 0.9rem;
}
</style>
