import type { Task } from '../types/task'

const STORAGE_KEY = 'vibe-coding-runoob-tasks'

export const saveTasks = (tasks: Task[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Ignore storage failures so the in-memory task list remains usable.
  }
}

export const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY)
    if (!storedTasks) {
      return []
    }

    const parsedTasks: unknown = JSON.parse(storedTasks)
    return Array.isArray(parsedTasks) ? parsedTasks as Task[] : []
  } catch {
    return []
  }
}
