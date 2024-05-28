<!-- eslint-disable vue/valid-v-slot -->

<template>
  <v-container>
    <v-row>
      <v-stepper v-model:model-value="position">
        <v-stepper-header>
          <v-stepper-item title="Create Product" value="1"></v-stepper-item>
          <v-stepper-item title="Transition States" value="2"></v-stepper-item>
          <v-stepper-item title="Transitions" value="3"></v-stepper-item>
          <v-stepper-item title="Rating Factors" value="4"></v-stepper-item>
          <v-stepper-item title="Benefit Structure" value="5"></v-stepper-item>
          <v-stepper-item title="Model Points" value="6"></v-stepper-item>
          <v-stepper-item title="Save Product" value="7"></v-stepper-item>
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item value="1">
            <create-product ref="currentStep" />
          </v-stepper-window-item>
          <v-stepper-window-item value="2">
            <transition-states ref="currentStep" />
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <transitions ref="currentStep" />
          </v-stepper-window-item>
          <v-stepper-window-item value="4">
            <rating-factors ref="currentStep" />
          </v-stepper-window-item>
          <v-stepper-window-item value="5">
            <features ref="currentStep" />
          </v-stepper-window-item>
          <v-stepper-window-item value="6">
            <model-points ref="currentStep" />
          </v-stepper-window-item>

          <v-row>
            <v-col>
              <v-btn
                class="ml-2 mb-3"
                size="small"
                rounded
                color="primary"
                :disabled="position === 0"
                @click="movePrev"
                >Prev</v-btn
              >
              <v-btn
                class="ml-9 mb-3"
                size="small"
                rounded
                color="primary"
                :disabled="position === 6"
                @click="moveNext"
                >Next</v-btn
              >
            </v-col>
          </v-row>
        </v-stepper-window>
      </v-stepper>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '@/renderer/store/product_config'

import CreateProduct from '@/renderer/components/productconfig/CreateProduct.vue'
import TransitionStates from '@/renderer/components/productconfig/TransitionStates.vue'
import Transitions from '@/renderer/components/productconfig/Transitions.vue'
import RatingFactors from '@/renderer/components/productconfig/RatingFactors.vue'
import Features from '@/renderer/components/productconfig/Features.vue'
import ModelPoints from '@/renderer/components/productconfig/ModelPoints.vue'

const store = useProductStore()
const position = ref(0)

const currentStep: any = ref(null)
const myproduct = store.getProduct

const moveNext = async () => {
  const isValid = currentStep.value ? await currentStep.value.validateForm() : false
  if (!isValid) {
    return
  }
  console.log(myproduct.product_name)
  console.log(myproduct.product_code)
  position.value++
}

const movePrev = () => {
  position.value--
}

// I want to make disabled reactive and a computed property
// const disabled = computed(() => {
//   return position.value === 1 ? 'prev' : position.value === steps.value ? 'next' : undefined
// })
</script>

<style scoped>
.title {
  color: green;
}

.title2 {
  color: red;
}

.v-stepper.v-sheet {
  color: black !important;
}

.color-black {
  color: black;
}
</style>
