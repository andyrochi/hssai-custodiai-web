<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <footer class="bg-white border-t">
    <div class="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
      <div class="md:flex md:justify-between">
        <!-- Left Info Section -->
        <div class="mb-6 md:mb-0 md:mr-4">
          <div>
            <div class="sm:flex sm:items-center sm:justify-start space-x-4">
              <a href="https://www.nthu.edu.tw/" target="_blank">
                <img src="@/assets/logo_nthu.png" class="h-12" alt="NTHU Logo" />
              </a>
              <a href="https://nthuhssai.site.nthu.edu.tw/" target="_blank">
                <img src="@/assets/logo_hssai.png" class="h-12" alt="HSSAI Logo" />
              </a>
            </div>
            <div class="mt-4 text-sm text-gray-500 font-semibold">
              <a href="https://nthuhssai.site.nthu.edu.tw/" target="_blank"
                >國立清華大學 人文社會AI應用與發展研究中心</a
              >
              <br />
              <a href="http://www.phys.nthu.edu.tw/~aicmt/" target="_blank">
                國立清華大學 AIFR人工智慧與基礎研究群</a
              >
            </div>
          </div>
        </div>
        <!-- Right Site Navigation -->
        <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">系統功能</h2>
            <ul class="text-gray-500 font-medium">
              <li class="mb-4">
                <RouterLink to="/" class="hover:underline">Le姊家事協商好夥伴</RouterLink>
              </li>
              <li class="mb-4">
                <RouterLink to="/mode1-options" class="hover:underline">模式一：選項</RouterLink>
              </li>
              <li class="mb-4">
                <RouterLink to="/mode2-text" class="hover:underline">模式二：文字</RouterLink>
              </li>
              <li>
                <RouterLink to="/mode3-options-text" class="hover:underline"
                  >模式三：選項加文字</RouterLink
                >
              </li>
            </ul>
          </div>
          <div class="md:ml-8">
            <!-- ml-8 is to make ui more balanced -->
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">系統簡介</h2>
            <ul class="text-gray-500 font-medium">
              <li class="mb-4">
                <RouterLink to="/user-guide" class="hover:underline">使用說明</RouterLink>
              </li>
              <li class="mb-4">
                <RouterLink to="/technical-guide" class="hover:underline">技術說明</RouterLink>
              </li>
              <li>
                <RouterLink to="/dev-team" class="hover:underline">友善資源</RouterLink>
              </li>
            </ul>
          </div>
          <div>
            <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase">關於我們</h2>
            <ul class="text-gray-500 font-medium">
              <li class="mb-4">
                <RouterLink to="/news-info" class="hover:underline">報導與介紹</RouterLink>
              </li>
              <li>
                <RouterLink to="/dev-team" class="hover:underline">開發團隊</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <!-- Footer lower -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <span class="text-sm text-gray-500 sm:text-center"
          >© 2024 <a href="https://flowbite.com/" class="hover:underline">清華大學AIFR研究群</a>.
          All Rights Reserved.
        </span>
        <div class="text-sm text-gray-500 mt-4 sm:text-center sm:mt-0">
          聯絡我們：<a href="mailto:aifr.general@gmail.com">aifr.general@gmail.com</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<style scoped></style>
