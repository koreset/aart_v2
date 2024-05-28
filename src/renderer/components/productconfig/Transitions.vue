<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-select
            v-model:model-value="startState"
            variant="outlined"
            density="compact"
            :items="selectedStartStates"
            label="Pick a start state (Health by default)"
            item-text="state"
            item-value="state"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model:model-value="endState"
            variant="outlined"
            density="compact"
            :items="selectedEndStates"
            label="Pick an end state"
            item-text="state"
            item-value="state"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="associatedTable"
            variant="outlined"
            density="compact"
            label="Associated rating table"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-checkbox v-model="absorbing" dense :label="`Absorbing`"></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn rounded size="small" color="accent" @click="addToTransitions"
            >Add to List of configured transitions</v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="applicableTransitions.length > 0">
        <v-col>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Start</th>
                <th class="text-left">End</th>
                <th class="text-left">Rating Table Name</th>
                <th class="text-left">Absorbing</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in applicableTransitions" :key="item.endState">
                <td>{{ item.startState }}</td>
                <td>{{ item.endState }}</td>
                <td>{{ item.associatedTable }}</td>
                <td>{{ item.absorbing }}</td>
                <td>
                  <v-btn variant="text" icon @click="removeItem(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ snackbarMessage }}
        <template #actions>
          <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import { useProductStore } from '@/renderer/store/product_config'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
const store = useProductStore()
const absorbing: any = ref(false)
const associatedTable: any = ref('')
const startState: any = ref(null)
const endState: any = ref(null)
const applicableTransitions: any = ref([])
const associatedTableErrors: any = ref([])
const startStateErrors: any = ref([])
const endStateErrors: any = ref([])

const snackbar: any = ref(false)
const snackbarMessage: any = ref('')
const timeout: any = ref(2000)

const rules = {
  associatedTable: { required },
  startState: { required },
  endState: { required }
}

const v$ = useVuelidate(rules, { associatedTable, startState, endState })

const selectedStartStates = computed(() => {
  return toRaw(store.getProductTransitionStates).filter((item: any) => item === 'Health')
})

const selectedEndStates = computed(() => {
  return toRaw(store.getProductTransitionStates).filter((item: any) => item !== 'Health')
})

const removeItem = (item: any) => {
  applicableTransitions.value = applicableTransitions.value.filter((i: any) => i !== item)

  store.removeFromTransitions(item)
  console.log('stored transitions:', store.getProductTransitions)
}

const addToTransitions = async () => {
  v$.value.$validate()
  const result = await v$.value.$validate()

  if (!result) {
    console.log('Errors:', v$.value.$errors)
    associatedTableErrors.value = []
    startStateErrors.value = []
    endStateErrors.value = []
    const errors: any = v$.value.$errors
    errors.forEach((error: any) => {
      if (error.$propertyPath === 'associatedTable') {
        associatedTableErrors.value.push(error.$message)
      }
      if (error.$propertyPath === 'startState') {
        startStateErrors.value.push(error.$message)
      }
      if (error.$propertyPath === 'endState') {
        endStateErrors.value.push(error.$message)
      }
    })
  } else {
    const payload: any = {}
    payload.startState = startState.value
    payload.endState = endState.value
    payload.associatedTable = associatedTable.value
    payload.absorbing = absorbing.value

    // check if the transition already exists
    const exists = applicableTransitions.value.find(
      (item: any) => item.startState === payload.startState && item.endState === payload.endState
    )
    if (exists) {
      snackbarMessage.value = 'This transition has already been defined'
      snackbar.value = true
    } else {
      applicableTransitions.value.push(payload)
      console.log('Payload:', payload)
      console.log('Applicable transitions:', applicableTransitions.value)
      store.addToTransitions(payload)
      startState.value = null
      endState.value = null
      absorbing.value = false
      associatedTable.value = ''
      v$.value.$reset()
    }
  }
}

const validateForm = async () => {
  if (!applicableTransitions.value || applicableTransitions.value.length === 0) {
    snackbarMessage.value = `Please define rating factors for the ${selectedEndStates.value.length} available transition(s)`
    snackbar.value = true
    return false
  }

  if (applicableTransitions.value.length !== selectedEndStates.value.length) {
    snackbarMessage.value = `Not all transitions have their rating factors defined`
    snackbar.value = true
    return false
  }

  // v$.value.$validate()
  // const result = await v$.value.$validate()

  // if (!result) {
  //   console.log('Errors:', v$.value.$errors)
  //   return false
  // }
  return true
}

defineExpose({
  validateForm
})
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
