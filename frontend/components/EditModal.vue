<template>
  <UModal :modelValue="open" @update:modelValue="emit('update:open')">
    <div class="p-4 w-full max-w-md mx-auto flex flex-col gap-4">
      <h2 class="text-xl font-semibold">Edit</h2>
      <template v-for="(_value, key) in formData" :key="String(key)">
        <UInput
          v-if="!hiddenColumns || !hiddenColumns.includes(String(key))"
          v-model="formData[String(key)]"
          :type="isDateField(String(key)) ? 'time' : 'text'"
          :placeholder="`Enter ${String(key)}`"
        />
      </template>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <div class="flex justify-end gap-2 mt-4">
        <UButton color="blue" variant="soft" @click="confirm">Save</UButton>
        <UButton color="red" variant="soft" @click="cancel">Cancel</UButton>
      </div>
    </div>
  </UModal>
</template>

<script
  setup
  lang="ts"
  generic="T extends Record<string, number | string | Date>"
>
const props = defineProps<{
  open: boolean
  hiddenColumns?: string[]
  row: T
  errorMessage: string
}>()

const emit = defineEmits(['update:open', 'edit:row', 'reset:error-message'])

const isDateField = (key: string) => props.row[key] instanceof Date

const parsedRow = computed(() => {
  const copy: Record<string, number | string> = {}
  for (const key in props.row) {
    const value = props.row[key]
    copy[key] = value instanceof Date ? dateToTimeString(value) : value
  }
  return copy
})

const formData = ref({ ...parsedRow.value })

watch(
  () => props.row,
  () => {
    formData.value = { ...parsedRow.value }
  },
  { immediate: true, deep: true }
)

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) formData.value = { ...parsedRow.value }
  }
)

watch(formData, () => emit('reset:error-message'), { deep: true })

const confirm = () => {
  const reparsedRow: Record<string, number | string | Date> = {}
  for (const key in formData.value) {
    const value = formData.value[key]
    reparsedRow[key] = isDateField(key)
      ? timeStringToDate(value as string)
      : value
  }
  emit('edit:row', reparsedRow)
}

const cancel = () => {
  emit('update:open', false)
}
</script>
