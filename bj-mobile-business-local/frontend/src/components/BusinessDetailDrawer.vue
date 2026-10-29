<template>
  <div class="drawer-mask" @click.self="$emit('close')">
    <section class="detail-drawer">
      <header>
        <h3>{{ item.name }}</h3>
        <button type="button" @click="$emit('close')">关闭</button>
      </header>
      <dl>
        <template v-for="row in rows" :key="row.key">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </template>
      </dl>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])

const labels = {
  category: '分类',
  code: '编码',
  ywCode: 'ywCode',
  offerId: 'offerId',
  field1: 'field1',
  xh: '序号',
  effectiveDate: '生效时间',
  expireDate: '到期时间',
  feeText: '资费/说明',
  statusText: '状态',
  provider: '提供方',
}

const categoryLabels = {
  base: '基础功能',
  package: '套餐',
  valueAdded: '增值业务',
  custom: '自定义',
}

const rows = computed(() => {
  const standard = Object.entries(labels)
    .map(([key, label]) => ({
      key,
      label,
      value: key === 'category' ? categoryLabels[props.item[key]] || props.item[key] : props.item[key],
    }))
    .filter((row) => row.value !== undefined && row.value !== null && String(row.value).trim())
  const rawRows = Object.entries(props.item.raw || {})
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => ({ key: `raw-${key}`, label: key, value: typeof value === 'object' ? JSON.stringify(value) : String(value) }))
  return [...standard, ...rawRows]
})
</script>
