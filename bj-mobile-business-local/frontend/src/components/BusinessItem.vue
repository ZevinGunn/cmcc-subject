<template>
  <article class="business-item">
    <div class="item-main">
      <div class="item-title-row">
        <h2>{{ item.name }}</h2>
        <button class="detail-btn" type="button" aria-label="查看业务详情" @click="$emit('detail', item)">?</button>
      </div>
      <div class="item-meta">
        <span>订购时间： {{ item.effectiveDate || '--' }}</span>
        <span>有效期限： {{ dateRange }}</span>
      </div>
      <div class="item-extra">
        <span v-if="item.feeText">资费：{{ item.feeText }}</span>
        <span v-if="item.statusText">{{ item.statusText }}</span>
        <span v-if="item.provider">{{ item.provider }}</span>
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
</script>
