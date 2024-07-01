<!-- NavLink.vue -->
<template>
  <div class="relative group">
    <RouterLink
      v-if="!hasChildren"
      :to="to"
      class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-600 md:p-0 md:text-nowrap"
      exactActiveClass="text-orange-700"
      @click="closeMenu"
    >
      <slot></slot>
    </RouterLink>
    <a
      v-if="hasChildren"
      href="#"
      class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-orange-600 md:p-0 md:text-nowrap flex items-center"
      :class="$route.path.indexOf('mode') >= 0 ? 'text-orange-700' : ''"
    >
      <slot></slot>
      <svg
        class="w-4 h-4 ml-2 transition-transform transform group-hover:rotate-180 group-focus-within:rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </a>
    <ul
      v-if="hasChildren"
      class="absolute hidden group-hover:block group-focus:block group-focus-within:block left-0 w-48 bg-white border border-gray-200 rounded shadow-lg z-10"
    >
      <li v-for="child in children" :key="child.to" class="py-2 px-4 hover:bg-gray-100">
        <RouterLink :to="child.to" @click="closeMenu" exactActiveClass="text-orange-700">
          {{ child.name }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  to: string
  closeMenu?: Function
  children?: { to: string; name: string }[]
}>()

const hasChildren = props.children && props.children.length > 0
</script>

<style scoped>
/* Ensuring dropdown stays open when focused
.group:focus-within .group-focus\:block {
  display: block;
} */
</style>
