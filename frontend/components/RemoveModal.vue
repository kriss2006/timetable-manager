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

<script setup lang="ts">
import axios from 'axios'

const props = defineProps<{
  type: string
  open: boolean
  row: Class
}>()

const emit = defineEmits(['update:open', 'remove:row'])

const errorMessage = ref('')

const handleRemove = async () => {
  switch (props.type) {
    case 'year':
      console.log('Remove year', props.row.name)
      break

    case 'class':
      await axios
        .delete(`http://localhost:3001/api/classes/${props.row.id}`)
        .catch((error) => {
          if (error.response) {
            errorMessage.value = error.response.data.error
            // console.error(error.response.data)
            // console.error(error.response.status)
            // console.error(error.response.headers)
          } else if (error.request) {
            // console.error(error.request)
          } else {
            // console.error('Error', error.message)
          }
          // console.error(error.config)
        })
      break

    case 'teacher':
      console.log('Remove teacher', props.row)
      break

    default:
      return
  }
}

const confirm = async () => {
  if (props.row.id) {
    await handleRemove()
    if (!errorMessage.value) {
      emit('remove:row', props.row.id)
      emit('update:open', false)
    }
  }
}

const cancel = () => {
  errorMessage.value = ''
  emit('update:open', false)
}
</script>
