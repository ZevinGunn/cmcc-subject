<template>
  <div class="dialog-mask message-mask" @click.self="$emit('close')">
    <section class="dialog message-dialog" :class="{ error: type === 'error', success: type === 'success' }">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button type="button" @click="$emit('close')">知道了</button>
    </section>
  </div>
</template>

<script setup>
defineProps({
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
})

defineEmits(['close'])
</script>
