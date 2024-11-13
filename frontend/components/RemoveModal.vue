<template>
  <UModal :modelValue="open" @update:modelValue="emit('update:open')">
    <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Remove</h2>
      <p class="text-500">
        Are you sure you would like to remove <b>{{ props.row.name }}</b
        >?
      </p>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="red" variant="soft" @click="confirm">Confirm</UButton>
        <UButton color="black" variant="soft" @click="cancel">Cancel</UButton>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts" generic="T extends Record<string, number | string>">
const props = defineProps<{
  open: boolean
  hiddenColumns: string[]
  row: T
  errorMessage: string
}>()

const emit = defineEmits(['update:open', 'remove:row', 'reset:error-message'])

const confirm = async () => {
  emit('remove:row', props.row.id)
}

const cancel = () => {
  emit('update:open', false)
}
</script>
