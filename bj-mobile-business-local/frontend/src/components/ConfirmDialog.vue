<template>
  <div class="dialog-mask" @click.self="$emit('cancel')">
    <section class="dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <label v-if="needsCode" class="confirm-code-field">
        <span>ywCode</span>
        <input v-model.trim="manualCode" placeholder="请输入 ywCode / offerId" />
      </label>
      <div class="dialog-actions">
        <button class="secondary" type="button" @click="$emit('cancel')">取消</button>
        <button class="danger" type="button" :disabled="loading || (needsCode && !manualCode)" @click="$emit('confirm', manualCode)">
          {{ loading ? '处理中' : '确认退订' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '确认退订',
  },
  message: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  needsCode: {
    type: Boolean,
    default: false,
  },
  initialCode: {
    type: String,
    default: '',
  },
})

defineEmits(['cancel', 'confirm'])

const manualCode = ref(props.initialCode)

watch(
  () => props.initialCode,
  (value) => {
    manualCode.value = value
  },
)
</script>
