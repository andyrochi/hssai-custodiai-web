<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>
  <main class="pt-[65px] md:pt-[125px] min-[928px]:pt-[101px] xl:pt-[61px]">
    <RouterView />
  </main>
</template>

<style scoped></style>
