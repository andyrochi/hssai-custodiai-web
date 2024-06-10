<template>
  <RouterLink
    :to="to"
    class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-600 md:p-0 md:text-nowrap"
    exactActiveClass="text-blue-700"
    @click="closeMenu"
  >
    <slot></slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{
  to: string
  closeMenu?: Function
}>()
</script>

<style scoped></style>
