<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Task } from '../types/task'

defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
}>()
</script>

<template>
  <ul class="space-y-3 p-4 sm:p-5">
    <li v-for="task in tasks" :key="task.id">
      <TaskCard :task="task" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
    </li>
  </ul>
</template>
