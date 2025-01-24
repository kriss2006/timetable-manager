<template>
  <div class="flex flex-col items-center my-2 gap-4 max-w-1/2">
    <h1 class="text-2xl font-bold">{{ title }}</h1>

    <UInput v-model="searchQuery" placeholder="Search" />

    <UTable :loading="isLoading" :rows="computedRows" :columns="columns">
      <template #actions-header>
        <div class="flex justify-end">
          <UButton
            color="blue"
            variant="soft"
            :disabled="isLoading"
            @click="
              () => {
                onAdd()
                currentPage = Math.ceil(rows.length / itemsPerPage)
              }
            "
          >
            Add
          </UButton>
        </div>
      </template>

      <template #actions-data="{ row }">
        <UButton color="blue" variant="soft" @click="onEdit(row)" class="mx-1">
          Edit
        </UButton>
        <UButton color="red" variant="soft" @click="onRemove(row)" class="mx-1">
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

<script
  setup
  lang="ts"
  generic="T extends Record<string, number | string | Object>"
>
const props = defineProps<{
  title: string
  isLoading: boolean
  columns: { key: string; label?: string }[]
  rows: T[]
  itemsPerPage: number
  onAdd: () => void
  onEdit: (row: T) => void
  onRemove: (row: T) => void
}>()

const searchQuery = ref('')
const currentPage = ref(1)

function matchesQuery(row: T) {
  const query = searchQuery.value.toLowerCase()
  const searchableRow = row as { [key: string]: any }
  return Object.keys(searchableRow).some(
    (key) =>
      key !== 'id' && String(searchableRow[key]).toLowerCase().includes(query)
  )
}

const filteredRowsCount = computed(() => {
  return props.rows.filter((row) => matchesQuery(row)).length
})

const computedRows = computed(() => {
  const filteredRows = props.rows.filter((row) => matchesQuery(row))
  const start = (currentPage.value - 1) * props.itemsPerPage
  return filteredRows.slice(start, start + props.itemsPerPage)
})
</script>
