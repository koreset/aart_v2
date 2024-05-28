<script setup lang="tsx">
import { DefaultLayout } from '@/renderer/components/layout'
import { onBeforeMount } from 'vue'

onBeforeMount(() => {
  window.mainApi?.send('msgResizeWindow', 1024, 600, true)
})
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<style>
html {
  overflow-y: auto !important;
  user-select: none;
}

html,
body {
  width: 100%;
  height: 100%;
}

/* Do not force capitalization of button text */
.v-btn {
  text-transform: unset !important;
}
</style>
