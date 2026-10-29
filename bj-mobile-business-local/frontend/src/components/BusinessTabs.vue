<template>
  <nav class="tabs" aria-label="业务分类">
    <button
      v-for="item in tabs"
      :key="item.key"
      class="tab"
      :class="{ active: modelValue === item.key }"
      type="button"
      @click="$emit('update:modelValue', item.key)"
    >
      {{ item.label }}
    </button>
  </nav>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

const tabs = [
  { key: 'package', label: '我的套餐' },
  { key: 'valueAdded', label: '增值业务' },
  { key: 'base', label: '基础功能' },
]
</script>
