<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue'
import AppFooter from '@/components/Footer/AppFooter.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <header>
    <NavBar />
  </header>
  <!-- The padding-top has been offsetted by 32px -->
  <main
    class="pb-8 pt-[97px] md:pt-[93px] bg-orange-100"
    :class="$route.name === 'home' ? 'h-dvh' : 'min-h-dvh'"
  >
    <RouterView />
  </main>
  <AppFooter />
  <Toast position="top-center" />
</template>

<style scoped></style>
