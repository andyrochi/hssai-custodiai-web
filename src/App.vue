<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue'
import AppFooter from '@/components/Footer/AppFooter.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>
  <main class="pt-[65px] md:pt-[125px] min-[928px]:pt-[101px] xl:pt-[61px]">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped></style>
