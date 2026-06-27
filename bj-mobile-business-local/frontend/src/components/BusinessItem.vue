<template>
  <article class="business-item">
    <div class="item-main">
      <div class="item-title-row">
        <h2>{{ item.name }}</h2>
        <button class="detail-btn" type="button" aria-label="查看业务详情" @click="$emit('detail', item)">?</button>
      </div>
      <div class="item-meta">
        <span>订购时间： {{ orderTime }}</span>
        <span>有效期限： {{ dateRange }}</span>
        <span v-if="unsubscribeTime">退订时间： {{ unsubscribeTime }}</span>
      </div>
    </div>
    <button class="unsubscribe-btn" type="button" @click="$emit('unsubscribe', item)">
      退订
    </button>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

defineEmits(['unsubscribe', 'detail'])

const dateRange = computed(() => {
  if (props.item.expireDate) return `${props.item.effectiveDate || '--'} 至 ${props.item.expireDate}`
  if (props.item.effectiveDate) return `${props.item.effectiveDate} 起 生效`
  return '--'
})

const orderTime = computed(() => props.item.raw?.openTime || props.item.effectiveDate || '--')
const unsubscribeTime = computed(() => props.item.raw?.unsubscribeTime || props.item.unsubscribeTime || '')
</script>
