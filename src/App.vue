<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoard from './components/KanbanBoard.vue'
import TaskList from './components/TaskList.vue'
import TaskModal from './components/TaskModal.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import { addTask, deleteTask, tasks, updateTask } from './stores/taskStore'
import type { TaskStatus } from './types/task'

const isTaskModalOpen = ref(false)
const viewMode = ref<'list' | 'kanban'>('list')
const isMobileMenuOpen = ref(false)

const toggleTask = (taskId: string) => {
  const task = tasks.find((item) => item.id === taskId)
  if (task) {
    updateTask(taskId, task.status === 'done' ? 'todo' : 'done')
  }
}

const moveTask = (taskId: string, status: TaskStatus) => {
  updateTask(taskId, status)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-800 dark:text-slate-100">
    <header class="border-b border-slate-200 bg-white transition-colors dark:border-slate-600 dark:bg-slate-700">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            VC
          </div>
          <h1 class="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Vibe Coding Runoob</h1>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <span class="hidden text-sm text-slate-500 dark:text-slate-300 sm:block">任务管理</span>
          <ThemeToggle />
          <button
            class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 dark:hover:text-white sm:hidden"
            type="button"
            :aria-expanded="isMobileMenuOpen"
            aria-controls="mobile-navigation"
            aria-label="打开导航菜单"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>
      <div v-if="isMobileMenuOpen" id="mobile-navigation" class="border-t border-slate-200 px-4 py-3 dark:border-slate-600 sm:hidden">
        <span class="text-sm font-medium text-slate-600 dark:text-slate-200">任务管理</span>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div class="mb-6 flex flex-col items-stretch justify-between gap-5 sm:mb-8 sm:flex-row sm:items-end sm:gap-4">
        <div>
          <p class="mb-2 text-sm font-medium text-indigo-600">我的工作台</p>
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">任务列表</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">专注当下，逐项完成重要的事情。</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="hidden rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-900/70 dark:text-indigo-200 sm:inline-flex">
            {{ tasks.length }} 个任务
          </span>
          <div class="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-700/80" role="tablist" aria-label="任务视图">
            <button
              class="min-h-11 rounded-md px-3 py-2 text-sm font-medium transition"
              :class="viewMode === 'list' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-600 dark:text-indigo-200' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white'"
              type="button"
              role="tab"
              :aria-selected="viewMode === 'list'"
              @click="viewMode = 'list'"
            >
              列表
            </button>
            <button
              class="min-h-11 rounded-md px-3 py-2 text-sm font-medium transition"
              :class="viewMode === 'kanban' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-600 dark:text-indigo-200' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white'"
              type="button"
              role="tab"
              :aria-selected="viewMode === 'kanban'"
              @click="viewMode = 'kanban'"
            >
              看板
            </button>
          </div>
          <button
            class="min-h-11 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus:ring-offset-slate-800"
            type="button"
            @click="isTaskModalOpen = true"
          >
            + 新建任务
          </button>
        </div>
      </div>

      <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-700" :aria-label="viewMode === 'list' ? '任务列表' : '任务看板'">
        <TaskList v-if="viewMode === 'list'" :tasks="tasks" @toggle="toggleTask" @delete="deleteTask" />
        <KanbanBoard v-else :tasks="tasks" @toggle="toggleTask" @delete="deleteTask" @move="moveTask" />
      </section>
    </main>

    <TaskModal v-model="isTaskModalOpen" @submit="addTask" />
  </div>
</template>
