<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Task, TaskStatus } from '../types/task'

type KanbanColumn = {
  status: TaskStatus
  title: string
  accent: string
}

defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
  move: [taskId: string, status: TaskStatus]
}>()

const columns: KanbanColumn[] = [
  { status: 'todo', title: '待办', accent: 'bg-slate-400' },
  { status: 'in-progress', title: '进行中', accent: 'bg-indigo-500' },
  { status: 'done', title: '已完成', accent: 'bg-emerald-500' },
]

let draggedTaskId = ''

const tasksForColumn = (tasks: Task[], status: TaskStatus) => tasks.filter((task) => task.status === status)

const handleDragStart = (event: DragEvent, taskId: string) => {
  draggedTaskId = taskId
  event.dataTransfer?.setData('text/plain', taskId)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDrop = (event: DragEvent, status: TaskStatus) => {
  event.preventDefault()
  const taskId = event.dataTransfer?.getData('text/plain') || draggedTaskId
  if (taskId) {
    emit('move', taskId, status)
  }
  draggedTaskId = ''
}

const clearDraggedTask = () => {
  draggedTaskId = ''
}
</script>

<template>
  <div class="grid grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-3 lg:p-5">
    <section
      v-for="column in columns"
      :key="column.status"
      class="min-h-80 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/80"
      :aria-label="column.title"
      @dragover.prevent
      @drop="handleDrop($event, column.status)"
    >
      <header class="mb-3 flex items-center justify-between px-1">
        <h3 class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">
          <span class="h-2 w-2 rounded-full" :class="column.accent"></span>
          {{ column.title }}
        </h3>
        <span class="text-xs font-medium text-slate-400 dark:text-slate-300">{{ tasksForColumn(tasks, column.status).length }}</span>
      </header>

      <div class="space-y-3">
        <div
          v-for="task in tasksForColumn(tasks, column.status)"
          :key="task.id"
          draggable="true"
          class="cursor-grab active:cursor-grabbing"
          @dragstart="handleDragStart($event, task.id)"
          @dragend="clearDraggedTask"
        >
          <TaskCard :task="task" @toggle="emit('toggle', $event)" @delete="emit('delete', $event)" />
        </div>
        <p v-if="tasksForColumn(tasks, column.status).length === 0" class="rounded-lg border border-dashed border-slate-300 px-3 py-8 text-center text-xs text-slate-400 dark:border-slate-500 dark:text-slate-300">
          拖拽任务到这里
        </p>
      </div>
    </section>
  </div>
</template>
