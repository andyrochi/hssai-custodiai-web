<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue'
import AppFooter from '@/components/Footer/AppFooter.vue'
</script>

<template>
  <header>
    <NavBar />
  </header>
  <main
    class="py-8 mt-[65px] md:mt-[125px] min-[928px]:mt-[101px] xl:mt-[61px] bg-slate-100 min-h-[70dvh]"
  >
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped></style>
