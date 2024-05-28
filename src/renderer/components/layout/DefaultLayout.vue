<script setup lang="tsx">
import NavigationDrawer from '@/renderer/components/NavigationDrawer.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const drawer = ref(true)

const route: any = useRoute()
const titleKey: string = (route?.meta?.titleKey || 'title.main') as string

const toggleDrawer = (): void => {
  drawer.value = !drawer.value
  console.log(drawer.value)
}
</script>

<template>
  <v-app>
    <v-app-bar
      scroll-behavior="elevate"
      scroll-threshold="688"
      class="custom-app"
      color="primary"
      density="compact"
    >
      <v-app-bar-nav-icon variant="text" @click="toggleDrawer()"></v-app-bar-nav-icon>
      <v-app-bar-title class="app-title">{{ $t(titleKey) }}</v-app-bar-title>
    </v-app-bar>
    <NavigationDrawer :drawer="drawer" />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped>
.custom-app {
  height: 40px;
}

.app-title {
  font-size: 14px;
  font-weight: 500;
}
</style>
