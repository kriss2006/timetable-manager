<template>
  <div class="wrapper">
    <div v-for="(row, key) in classes" :key="key" class="row">
      <div v-for="item in row" :key="item" class="box">{{ item }}</div>
    </div>
  </div>
</template>

<script setup>
const classes = { 8: ['8a', '8b', '8v'], 9: ['9a', '9b'] }
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5vh;
  margin: 5vh 0;
}

.row {
  display: flex;
  justify-content: center;
  gap: 2.5vw;
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
