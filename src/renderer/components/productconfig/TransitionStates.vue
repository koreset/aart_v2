<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model:model-value="selectedTransitions"
          clearable
          multiple
          chips
          variant="outlined"
          density="compact"
          :items="transitions"
          item-title="state"
          item-value="state"
          placeholder="Select transition states"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useProductStore } from '@/renderer/store/product_config'
import { onMounted, ref } from 'vue'
import ProductService from '@/renderer/api/ProductService.js'

const store = useProductStore()
const product = store.getProduct
const transitions: any = ref([])
const selectedTransitions: any = ref(null)

onMounted(() => {
  console.log('Product from transition state:', product)
  ProductService.getTransitionStates().then((resp) => {
    transitions.value = resp.data
    console.log('Transitions:', transitions.value)
  })
})

const validateForm = async () => {
  if (!selectedTransitions.value) {
    return false
  }

  store.setProductTransitionStates(selectedTransitions.value)
  return true
}

defineExpose({
  validateForm
})
</script>

<style scoped></style>
