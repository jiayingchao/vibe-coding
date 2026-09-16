<script setup lang="ts">
import { onMounted, ref } from 'vue'

const THEME_KEY = 'vibe-coding-runoob-theme'
const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
}

const toggleTheme = () => {
  const nextThemeIsDark = !isDark.value
  applyTheme(nextThemeIsDark)
  localStorage.setItem(THEME_KEY, nextThemeIsDark ? 'dark' : 'light')
}

onMounted(() => {
  const savedTheme = localStorage.getItem(THEME_KEY)
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme === 'dark')
    return
  }

  applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches)
})
</script>

<template>
  <button
    class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
    type="button"
    :aria-label="isDark ? '切换到亮色模式' : '切换到深色模式'"
    :title="isDark ? '亮色模式' : '深色模式'"
    @click="toggleTheme"
  >
    <span aria-hidden="true">{{ isDark ? '☀' : '☾' }}</span>
  </button>
</template>
