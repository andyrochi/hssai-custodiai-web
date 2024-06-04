<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import NavLink from '@/components/NavBar/NavLink.vue'

const menuOpen = ref<Boolean>(false)

const menuClass = computed(() => {
  return {
    'items-center justify-between hidden w-full md:flex md:w-auto md:order-2': !menuOpen.value,
    'items-center justify-between w-full md:flex md:w-auto md:order-2': menuOpen.value
  }
})

const toggleMenu = () => {
  console.log('toggle', menuOpen.value)
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}
</script>

<template>
  <nav class="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
    <div class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
      <RouterLink to="/" class="flex items-center space-x-3">
        <!-- <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" /> -->
        <span class="self-center text-xl font-semibold whitespace-nowrap"
          >AI輔助親權裁判預測系統
        </span>
      </RouterLink>
      <!-- Hamburger Menu -->
      <div class="flex md:order-2 space-x-3 md:space-x-0">
        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          class="inline-flex items-center p-2 w-8 h-8 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-sticky"
          aria-expanded="false"
          @click="toggleMenu"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
      <!-- Navigations -->
      <div :class="menuClass" id="navbar-sticky">
        <ul
          class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white"
        >
          <li>
            <NavLink to="/" :closeMenu>首頁</NavLink>
          </li>
          <li>
            <NavLink to="/news-info" :closeMenu>報導與介紹</NavLink>
          </li>
          <li>
            <NavLink to="/mode1-options" :closeMenu>模式一：選項</NavLink>
          </li>
          <li>
            <NavLink to="/mode2-text" :closeMenu>模式二：文字</NavLink>
          </li>
          <li>
            <NavLink to="/mode3-options-text" :closeMenu>模式三：選項加文字</NavLink>
          </li>
          <li>
            <NavLink to="/friendly-resources" :closeMenu>友善資源</NavLink>
          </li>
          <li>
            <NavLink to="/user-guide" :closeMenu>使用說明</NavLink>
          </li>
          <li>
            <NavLink to="/technical-guide" :closeMenu>技術說明</NavLink>
          </li>
          <li>
            <NavLink to="/dev-team" :closeMenu>開發團隊</NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped></style>
