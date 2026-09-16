import { reactive, watch } from 'vue'
import type { Task, TaskStatus } from '../types/task'
import { loadTasks, saveTasks } from '../utils/storage'

export type NewTask = Pick<Task, 'title' | 'description' | 'priority'>

type TaskUpdate = Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'dueDate'>>

const exampleTasks: Task[] = [
  {
    id: 'task-1',
    title: '梳理产品需求',
    description: '整理本周需要交付的功能清单和优先级。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-18',
    createdAt: '2026-09-15',
  },
  {
    id: 'task-2',
    title: '设计任务列表',
    description: '确定任务卡片的信息层级与交互状态。',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-09-20',
    createdAt: '2026-09-16',
  },
  {
    id: 'task-3',
    title: '初始化项目结构',
    description: '完成 Vue 3、Vite 与 Tailwind CSS 的基础配置。',
    status: 'done',
    priority: 'low',
    dueDate: '2026-09-16',
    createdAt: '2026-09-14',
  },
]

const storedTasks = loadTasks()
export const tasks = reactive<Task[]>(storedTasks.length > 0 ? storedTasks : exampleTasks)

if (storedTasks.length === 0) {
  saveTasks(tasks)
}

watch(
  tasks,
  (updatedTasks) => {
    saveTasks(updatedTasks)
  },
  { deep: true },
)

export const addTask = (task: NewTask) => {
  const today = new Date().toISOString().slice(0, 10)
  tasks.unshift({
    ...task,
    id: `task-${Date.now()}`,
    status: 'todo',
    dueDate: today,
    createdAt: today,
  })
}

export const updateTask = (taskId: string, updates: TaskUpdate | TaskStatus) => {
  const task = tasks.find((item) => item.id === taskId)
  if (!task) {
    return
  }

  if (typeof updates === 'string') {
    task.status = updates
    return
  }

  Object.assign(task, updates)
}

export const deleteTask = (taskId: string) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId)
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1)
  }
}
