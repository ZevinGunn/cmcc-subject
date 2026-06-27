<template>
  <div class="message-toast-wrap">
    <section class="message-toast" :class="{ error: type === 'error', success: type === 'success' }">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '提示',
  },
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
  },
  duration: {
    type: Number,
    default: 2200,
  },
})

const emit = defineEmits(['close'])
let timer = null

onMounted(() => {
  timer = setTimeout(() => emit('close'), props.duration)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>
