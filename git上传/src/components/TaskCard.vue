<script setup lang="ts">
import type { Task } from '../types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: [taskId: string]
  delete: [taskId: string]
}>()

const priorityStyles = {
  high: 'border-l-rose-500',
  medium: 'border-l-amber-400',
  low: 'border-l-emerald-500',
}

const priorityLabels = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
}

const formatDate = (date: string) => {
  const [, month, day] = date.split('-')
  return `${month}月${day}日`
}
</script>

<template>
  <article
    class="group relative flex gap-3 border-l-4 bg-white px-5 py-4 shadow-sm transition-transform duration-200 hover:scale-[1.02] dark:bg-slate-600/90 dark:shadow-none"
    :class="priorityStyles[task.priority]"
  >
    <input
      :id="`task-${task.id}`"
      class="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
      type="checkbox"
      :checked="task.status === 'done'"
      :aria-label="`标记任务“${task.title}”为完成`"
      @change="emit('toggle', task.id)"
    />

    <div class="min-w-0 flex-1">
      <label
        :for="`task-${task.id}`"
        class="block cursor-pointer font-semibold text-slate-900 dark:text-white"
        :class="{ 'text-slate-400 line-through dark:text-slate-400': task.status === 'done' }"
      >
        {{ task.title }}
      </label>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-200" :class="{ 'line-through': task.status === 'done' }">
        {{ task.description }}
      </p>
      <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-300">
        <span class="font-medium" :class="{
          'text-rose-600 dark:text-rose-300': task.priority === 'high',
          'text-amber-600 dark:text-amber-300': task.priority === 'medium',
          'text-emerald-600 dark:text-emerald-300': task.priority === 'low',
        }">
          {{ priorityLabels[task.priority] }}
        </span>
        <time :datetime="task.dueDate">截止 {{ formatDate(task.dueDate) }}</time>
      </div>
    </div>

    <button
      class="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-md text-lg leading-none text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:text-slate-300 dark:hover:bg-rose-900/50 dark:hover:text-rose-200 dark:focus:ring-offset-slate-600"
      type="button"
      :aria-label="`删除任务“${task.title}”`"
      @click="emit('delete', task.id)"
    >
      ×
    </button>
  </article>
</template>
