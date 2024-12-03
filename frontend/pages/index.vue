<template>
  <div class="wrapper">
    <div v-for="item in classes" :key="item.id" class="box">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore()

const classes = ref<StudentClass[]>([])

onMounted(async () => {
  const resultClasses = await store.fetchClasses()
  if (resultClasses) {
    classes.value = resultClasses
  }
})
</script>
<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5vh;
  margin: 5vh auto;
  width: 50vw;
}

.box {
  width: 10vmax;
  height: 10vmax;
  background-color: lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12.5%;
}
</style>
