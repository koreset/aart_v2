<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col>
          <h2>Application Setup</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <activation />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted } from 'vue'
import Activation from '@/renderer/components/setup/Activation.vue'
// import Database from '@/renderer/components/setup/Database.vue'

onBeforeMount(() => {
  console.log('Login component before mount')
  window.mainApi?.send('msgResizeWindow', 1024, 600, false)
})
onMounted(() => {
  console.log('Login component mounted')
})

// const position = ref(0)

// const moveNext = () => {
//   position.value++
// }

// const movePrev = () => {
//   position.value--
// }

// const nextTitle = () => {
//   if (position.value === 0) {
//     return 'Next'
//   } else if (position.value === 1) {
//     return 'Next'
//   } else if (position.value === 2) {
//     return 'Complete Setup'
//   }
// }
</script>

<style scoped>
/* Add your component styles here */
.stepper-height {
  height: 100%;
}

.v-stepper.v-sheet {
  color: black !important;
}
</style>
