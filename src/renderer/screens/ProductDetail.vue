<template>
  <v-container>
    <v-card>
      <v-card-title>{{ product.product_code }}</v-card-title>
      <v-card-text>
        <v-expansion-panels variant="inset" class="my-4">
          <v-expansion-panel title="Model Point Variables">
            <v-expansion-panel-text>
              <model-point-variable-display :modelPointVars="modelPointVars" />
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Transition States">
            <v-expansion-panel-text>
              {{ transitionStates }}
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Transitions">
            <v-expansion-panel-text>
              <p v-for="item in product.product.product_transitions" :key="item.end_state" class="mb-6">{{
                item.start_state }} => {{
    item.end_state }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Benefit Structure">
            <v-expansion-panel-text>
              <p v-for="item in benefitStructures" :key="item" class="mb-5">{{ item }}</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel title="Associated Tables">
            <v-expansion-panel-text>
              <associated-table-display :product="product" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

    </v-card>

  </v-container>
</template>

<script setup lang="ts">
import ProductService from "../api/ProductService";
// import TaskService from "../api/TaskService";
// import ActivityService from "../api/ActivityService";
import { ref, watchEffect, onMounted } from "vue";
import { useRoute } from "vue-router";
import ModelPointVariableDisplay from "../components/ModelPointVariableDisplay.vue";
import AssociatedTableDisplay from "../components/AssociatedTableDisplay.vue";

const route = useRoute()

const product: any = ref({})
const paramId: any = ref(0)
const modelPointVars: any = ref([])
const transitionStates: any = ref([])
const benefitStructures: any = ref([])

watchEffect(async () => {
  paramId.value = route.params.id
  console.log("Param ID", paramId.value)
  const response = await ProductService.getProductById(paramId.value)
  console.log("Response", response.data.product)
  product.value = response.data
  modelPointVars.value = response.data.product.product_modelpoint_variables
  console.log("Model Point Vars", modelPointVars.value)
  transitionStates.value = response.data.product.product_transition_states.map(item => item.state).join(', ');
  console.log("Transition States", transitionStates.value)

  const trueKeys = Object.entries(response.data.product.product_features)
    .filter(([key, value]) => value === true)
    .map(([key]) => key);

  benefitStructures.value = trueKeys.map(key =>
    key.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );

  console.log(benefitStructures);
})

onMounted(async () => {
  paramId.value = route.params.id
  console.log("Param ID", paramId.value)
  const response = await ProductService.getProductById(paramId.value)
  console.log("Response", response)
  product.value = response.data

})


</script>

<style scoped></style>
