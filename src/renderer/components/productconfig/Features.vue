<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-select
            v-model="selectedFeatures"
            variant="outlined"
            density="compact"
            :error-messages="selectedFeaturesErrors"
            label="Please choose applicable features for the product"
            :items="features"
            item-title="name"
            item-value="id"
            chips
            closable-chips
            multiple
            return-object
            @update:model-value="clearErrors"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend="{ isActive }">
                  <v-list-item-action start>
                    <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                  </v-list-item-action>
                </template>
                <v-list-item-subtitle>
                  {{ getDescription(item.raw) }}
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductService from '../../api/ProductService'
// import { required } from 'vuelidate/lib/validators'
import { useVuelidate } from '@vuelidate/core'
import { useProductStore } from '../../store/product_config'

const store = useProductStore()
const mutualExclusive = (value: any) => {
  console.log('mutual exclusive:', value)
  const funeral = value.some(
    (item: any) => item !== null && item !== undefined && item.name === 'FUNERAL_COVER'
  )
  const creditLife = value.some(
    (item: any) => item !== null && item !== undefined && item.name === 'CREDIT_LIFE'
  )
  if (funeral && creditLife) {
    return false
  } else {
    return true
  }
}

const features: any = ref([])
const selectedFeatures: any = ref([])
const selectedFeaturesErrors: any = ref([])

const rules = {
  selectedFeatures: {
    mutualExclusive
  }
}

const v$ = useVuelidate(rules, { selectedFeatures })

const getDescription = (item: any) => item.description || ''

onMounted(() => {
  ProductService.getFeatures().then((resp: any) => {
    features.value = resp.data
    console.log(features.value)
  })
})
const clearErrors = () => {
  selectedFeaturesErrors.value = []
}

const validateForm = async () => {
  const result = await v$.value.$validate()
  if (!result) {
    v$.value.$errors.forEach((error: any) => {
      console.log(error.$propertyPath)
      if (error.$propertyPath === 'selectedFeatures') {
        selectedFeaturesErrors.value =
          'Funeral Cover and Credit Life features are mutually exclusive. Please select only one.'
      }
    })
    console.log('found error:', selectedFeaturesErrors.value)
  } else {
    store.setProductFeatures(selectedFeatures.value)
    console.log('no error')
  }

  return result
}

defineExpose({
  validateForm
})
</script>
