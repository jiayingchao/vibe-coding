<script setup lang="ts">
import { onBeforeUnmount, reactive, watch } from 'vue'
import type { TaskPriority } from '../types/task'

type TaskForm = {
  title: string
  description: string
  priority: TaskPriority
}

type TaskDraft = TaskForm

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [task: TaskDraft]
}>()

const form = reactive<TaskForm>({
  title: '',
  description: '',
  priority: 'medium',
})

const errors = reactive({
  title: '',
})

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  errors.title = ''
}

const close = () => {
  emit('update:modelValue', false)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

const submit = () => {
  errors.title = form.title.trim() ? '' : '标题不能为空'
  if (errors.title) {
    return
  }

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
  })
  close()
  resetForm()
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0 sm:translate-y-4"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0 sm:translate-y-4"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 px-0 py-0 dark:bg-slate-950/65 sm:items-center sm:px-4 sm:py-6"
        role="presentation"
        @click.self="close"
      >
        <form
          class="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl dark:bg-slate-700 dark:shadow-black/30 sm:max-w-md sm:rounded-xl sm:p-6"
          aria-labelledby="task-modal-title"
          @submit.prevent="submit"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="task-modal-title" class="text-xl font-semibold text-slate-900 dark:text-white">新建任务</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">记录一件接下来要完成的事情。</p>
            </div>
            <button
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-600 dark:hover:text-white"
              type="button"
              aria-label="关闭弹窗"
              @click="close"
            >
              ×
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-title">标题 <span class="text-rose-500">*</span></label>
              <input
                id="task-title"
                v-model="form.title"
                class="w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-600 dark:text-white dark:placeholder:text-slate-300 dark:focus:ring-indigo-950 sm:text-sm"
                :class="errors.title ? 'border-rose-400' : 'border-slate-300 dark:border-slate-500'"
                type="text"
                placeholder="例如：完成项目原型"
                @input="errors.title = ''"
              />
              <p v-if="errors.title" class="mt-1.5 text-sm text-rose-600">{{ errors.title }}</p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-description">描述</label>
              <textarea
                id="task-description"
                v-model="form.description"
                class="min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-500 dark:bg-slate-600 dark:text-white dark:placeholder:text-slate-300 dark:focus:ring-indigo-950 sm:text-sm"
                placeholder="补充任务细节（选填）"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300" for="task-priority">优先级</label>
              <select
                id="task-priority"
                v-model="form.priority"
                class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-500 dark:bg-slate-600 dark:text-white dark:focus:ring-indigo-950 sm:text-sm"
              >
                <option value="low">低优先级</option>
                <option value="medium">中优先级</option>
                <option value="high">高优先级</option>
              </select>
            </div>
          </div>

          <div class="mt-7 flex justify-end gap-3">
            <button
              class="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-600"
              type="button"
              @click="close"
            >
              取消
            </button>
            <button
              class="min-h-11 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
              type="submit"
            >
              创建任务
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>
