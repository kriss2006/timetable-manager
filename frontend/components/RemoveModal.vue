<template>
  <UModal :modelValue="data.open" @update:modelValue="emit('close')">
    <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Remove</h2>
      <p class="text-500">
        Are you sure you would like to remove <b>{{ props.data.name }}</b
        >?
      </p>
      <p v-if="data.errorMessage" class="text-red-500">
        {{ data.errorMessage }}
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="red" variant="soft" @click="confirm">Confirm</UButton>
        <UButton color="black" variant="soft" @click="cancel">Cancel</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: RemoveModalData
}>()

const emit = defineEmits(['close', 'remove'])

const confirm = async () => {
  emit('remove', props.data)
}

const cancel = () => {
  emit('close')
}
</script>
