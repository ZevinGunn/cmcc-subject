<template>
  <header class="topbar">
    <button class="nav-icon" type="button" @click="$emit('back')" aria-label="返回">
      <ChevronLeft :size="34" stroke-width="2.2" />
    </button>
    <h1>{{ title }}</h1>
    <button class="nav-icon" type="button" @click="$emit('home')" aria-label="首页">
      <Home :size="30" stroke-width="2.2" />
    </button>
  </header>
</template>

<script setup>
import { ChevronLeft, Home } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: '业务查询',
  },
})

defineEmits(['back', 'home'])
</script>
