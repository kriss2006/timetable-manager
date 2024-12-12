<template>
  <div
    class="border-2 px-2 py-4 my-1 rounded-lg text-center select-none hover:bg-slate-600 cursor-pointer"
    @click="emit('on:click')"
  >
    <h1 class="text-xl">+</h1>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['on:click'])
</script>
