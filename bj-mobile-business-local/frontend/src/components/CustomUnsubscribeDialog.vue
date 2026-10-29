<template>
  <div class="dialog-mask" @click.self="$emit('cancel')">
    <section class="dialog custom-dialog">
      <h3>自定义退订</h3>
      <div class="custom-form">
        <label>
          <span>ywCode / offerId</span>
          <input v-model.trim="form.ywCode" placeholder="必填" />
        </label>
        <label>
          <span>field1 / 序号</span>
          <input v-model.trim="form.field1" placeholder="可选" />
        </label>
        <label>
          <span>业务名称</span>
          <input v-model.trim="form.name" placeholder="可选" />
        </label>
        <label>
          <span>手机号</span>
          <input v-model.trim="form.phoneNum" placeholder="默认使用登录号码" />
        </label>
        <label>
          <span>品牌</span>
          <input v-model.trim="form.brand" placeholder="默认使用当前品牌" />
        </label>
      </div>
      <div class="dialog-actions">
        <button class="secondary" type="button" @click="$emit('cancel')">取消</button>
        <button class="danger" type="button" :disabled="loading || !form.ywCode" @click="submit">
          {{ loading ? '处理中' : '提交退订' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'submit'])

const form = reactive({
  ywCode: '',
  field1: '',
  name: '',
  phoneNum: '',
  brand: '',
})

function submit() {
  emit('submit', {
    category: 'custom',
    name: form.name || `自定义业务 ${form.ywCode}`,
    ywCode: form.ywCode,
    offerId: form.ywCode,
    code: form.ywCode,
    field1: form.field1,
    phoneNum: form.phoneNum,
    brand: form.brand,
    custom: true,
  })
}
</script>
