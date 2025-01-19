<template>
  <div class="flex flex-col items-center my-2 gap-4">
    <UsersTable
      title="Manage users"
      :isLoading="usersLoading"
      :columns="columns"
      :rows="users"
      :itemsPerPage="8"
      :onEdit="openEditModal"
      :onRemove="openRemoveModal"
    />
    <div class="flex gap-2 my-4">
      <UButton
        v-if="!usersLoading"
        color="blue"
        variant="soft"
        @click="exportUsers"
        >Export</UButton
      >
    </div>
  </div>

  <EditModal
    :data="editModalData"
    @close="editModalData.open = false"
    @reset:error-message="editModalData.errorMessage = ''"
    @edit="editRow($event)"
  />
  <RemoveModal
    :data="removeModalData"
    @close="removeModalData.open = false"
    @reset:error-message="removeModalData.errorMessage = ''"
    @remove="removeRow($event)"
  />
</template>

<script setup lang="ts">
import axios from 'axios'
import * as XLSX from 'xlsx'

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const store = useAdminStore()
const { usersLoading } = storeToRefs(store)

const users = ref<User[]>([])

onMounted(async () => {
  users.value = await store.fetchUsers()
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'type', label: 'Type' },
  { key: 'actions' },
]

const editModalData = ref<ModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  input: {
    name: '',
    username: '',
    type: '',
  },
})

const openEditModal = (row: User) => {
  editModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    input: { name: row.name, username: row.username, type: row.type },
  }
}

const editRow = async (data: ModalData) => {
  await axios
    .patch(`http://localhost:3001/api/users/${data.id}`, {
      name: data.input.name,
      username: data.input.username,
      type: data.input.type,
    })
    .then(() => {
      const index = users.value.findIndex((item) => item.id === data.id)
      if (
        index !== -1 &&
        typeof data.input.name === 'string' &&
        typeof data.input.username === 'string' &&
        typeof data.input.type === 'string'
      ) {
        users.value[index] = {
          id: data.id,
          name: data.input.name,
          username: data.input.username,
          type: data.input.type,
        }
      }

      editModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        editModalData.value.errorMessage = error.response.data.error
      }
    })
}

const removeModalData = ref<RemoveModalData>({
  open: false,
  errorMessage: '',
  id: NaN,
  name: '',
})

const openRemoveModal = (row: User) => {
  removeModalData.value = {
    open: true,
    errorMessage: '',
    id: row.id,
    name: row.username,
  }
}

const removeRow = async (data: RemoveModalData) => {
  await axios
    .delete(`http://localhost:3001/api/users/${data.id}`)
    .then(() => {
      const index = users.value.findIndex((item) => item.id === data.id)
      if (index !== -1) {
        users.value.splice(index, 1)
      }

      removeModalData.value.open = false
    })
    .catch((error) => {
      if (error.response) {
        removeModalData.value.errorMessage = error.response.data.error
      }
    })
}

const exportUsers = () => {
  if (users.value.length === 0) {
    alert('No users available to export.')
    return
  }

  const exportData = users.value.map((user) => ({
    Name: user.name,
    Username: user.username,
    Type: user.type,
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

  XLSX.writeFile(workbook, 'users.xlsx')
}
</script>
