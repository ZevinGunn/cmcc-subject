<template>
  <div class="dialog-mask" @click.self="$emit('cancel')">
    <section class="dialog unsubscribe-dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="unsubscribe-endpoint">
        <span>POST</span>
        <code>/portal-bff/api/packageQuery/v1.0/unsubscribe</code>
      </div>
      <div class="unsubscribe-parameters">
        <label>
          <span><code>phoneNum</code><small>手机号</small></span>
          <input v-model="parameters.phoneNum" type="tel" inputmode="numeric" autocomplete="off" spellcheck="false" />
        </label>
        <label>
          <span><code>brand</code><small>品牌</small></span>
          <input v-model="parameters.brand" type="text" autocomplete="off" spellcheck="false" />
        </label>
        <label>
          <span><code>field1</code><small>退订业务编码</small></span>
          <input v-model="parameters.field1" type="text" autocomplete="off" spellcheck="false" placeholder="ywCode / offerId" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="secondary" type="button" @click="$emit('cancel')">取消</button>
        <button class="danger" type="button" :disabled="loading || !isComplete" @click="submit">
          {{ loading ? '处理中' : '确认退订' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

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
  initialParameters: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['cancel', 'confirm'])

const parameters = reactive({
  phoneNum: '',
  brand: '',
  field1: '',
})
const isComplete = computed(() => Object.values(parameters).every((value) => String(value || '').trim()))

function submit() {
  if (!isComplete.value) return
  emit('confirm', {
    phoneNum: parameters.phoneNum.trim(),
    brand: parameters.brand.trim(),
    field1: parameters.field1.trim(),
  })
}

watch(
  () => props.initialParameters,
  (value) => {
    parameters.phoneNum = String(value?.phoneNum || '')
    parameters.brand = String(value?.brand || '')
    parameters.field1 = String(value?.field1 || '')
  },
  { deep: true, immediate: true },
)
</script>
