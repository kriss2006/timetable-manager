<template>
  <div class="flex flex-col items-center my-2 gap-4 max-w-1/2">
    <h1 class="text-2xl font-bold">{{ title }}</h1>

    <UInput v-model="searchQuery" placeholder="Search" />

    <UTable :loading="!rows.length" :rows="computedRows" :columns="columns">
      <template #actions-data="{ row }">
        <UButton color="blue" variant="soft" @click="onEdit(row)" class="mx-1">
          Edit
        </UButton>
        <UButton
          color="red"
          variant="soft"
          @click="onRemove(row.id)"
          class="mx-1"
        >
          Remove
        </UButton>
      </template>
    </UTable>

    <UPagination
      v-model="currentPage"
      :page-count="itemsPerPage"
      :total="filteredRowsCount"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  columns: { key: string; label?: string }[]
  rows: Class[]
  itemsPerPage: number
  onEdit: (row: Class) => void
  onRemove: (row: Class) => void
}>()

const searchQuery = ref('')
const currentPage = ref(1)

const filteredRowsCount = computed(
  () =>
    props.rows.filter((row) =>
      row.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    ).length
)

const computedRows = computed(() => {
  const filteredRows = props.rows.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  const start = (currentPage.value - 1) * props.itemsPerPage
  return filteredRows.slice(start, start + props.itemsPerPage)
})
</script>
