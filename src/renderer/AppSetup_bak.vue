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
          <v-stepper v-model:model-value="position" class="stepper-height">
            <v-stepper-header>
              <v-stepper-item title="License Activation" value="1"></v-stepper-item>
              <v-stepper-item title="Set Api Location" value="2"></v-stepper-item>
              <v-stepper-item title="Complete Setup" value="3"></v-stepper-item>
            </v-stepper-header>
            <v-stepper-window>
              <v-stepper-window-item value="1">
                <activation ref="currentStep" />
              </v-stepper-window-item>
              <v-stepper-window-item value="2">
                <database ref="currentStep" />
              </v-stepper-window-item>
              <!-- <v-stepper-window-item value="3">
              <transitions ref="currentStep" />
            </v-stepper-window-item> -->
              <v-row class="mt-2">
                <v-col>
                  <v-btn
                    v-if="position > 0"
                    class="ml-2 mb-3"
                    size="small"
                    rounded
                    color="primary"
                    :disabled="position === 0"
                    @click="movePrev"
                    >Previous</v-btn
                  >
                  <v-btn
                    class="ml-9 mb-3"
                    size="small"
                    rounded
                    color="primary"
                    :disabled="position === 2"
                    @click="moveNext"
                    >{{ nextTitle() }}</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-window>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import Activation from '@/renderer/components/setup/Activation.vue'
import Database from '@/renderer/components/setup/Database.vue'

onBeforeMount(() => {
  console.log('Login component before mount')
  window.mainApi?.send('msgResizeWindow', 1024, 600, false)
})
onMounted(() => {
  console.log('Login component mounted')
})

const position = ref(0)

const moveNext = () => {
  position.value++
}

const movePrev = () => {
  position.value--
}

const nextTitle = () => {
  if (position.value === 0) {
    return 'Next'
  } else if (position.value === 1) {
    return 'Next'
  } else if (position.value === 2) {
    return 'Complete Setup'
  }
}
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
