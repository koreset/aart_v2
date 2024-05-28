<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="selectedTable"
            variant="outlined"
            density="compact"
            :error-messages="selectedTableErrors"
            label="Pick a rating table"
            :items="transitions"
            item-title="associatedTable"
            item-value="associatedTable"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="fd1.factor"
            variant="outlined"
            density="compact"
            clearable
            :error-messages="fd1FactorErrors"
            label="Choose a rating factor"
            :items="factors"
            item-title="factor"
            item-value="factor"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fd1.dimension"
            variant="outlined"
            density="compact"
            label="Dimension"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="fd2.factor"
            clearable
            variant="outlined"
            density="compact"
            label="Choose a rating factor"
            :items="factors"
            item-title="factor"
            item-value="factor"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fd2.dimension"
            variant="outlined"
            density="compact"
            label="Dimension"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="fd3.factor"
            clearable
            variant="outlined"
            density="compact"
            label="Choose a rating factor"
            :items="factors"
            item-title="factor"
            item-value="factor"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fd3.dimension"
            variant="outlined"
            density="compact"
            label="Dimension"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="fd4.factor"
            clearable
            variant="outlined"
            density="compact"
            label="Choose a rating factor"
            :items="factors"
            item-title="factor"
            item-value="factor"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fd4.dimension"
            variant="outlined"
            density="compact"
            label="Dimension"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn rounded small dark color="accent" @click="addToRatingFactors"
            >Add to Configured Tables</v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="applicableFactors.length > 0">
        <v-col>
          <v-table class="trans-tables">
            <thead>
              <tr>
                <th class="text-left">Rating Table</th>
                <th class="text-left">Factors</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in applicableFactors" :key="item.table">
                <td>{{ item.table }}</td>
                <td>
                  <v-list>
                    <v-list-item v-for="i in item.fds" :key="i.factor">
                      {{ i.factor }} ({{ i.dimension }})
                    </v-list-item>
                  </v-list>
                </td>
                <td>
                  <v-btn variant="text" icon @click="removeFromList(item.table)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
          <!-- <v-alert v-if="applicableFactorsErrors.length > 0" variant="outlined" density="compact" type="error">
            {{ applicableFactorsErrors[0] }}
          </v-alert> -->
        </v-col>
      </v-row>
      <v-divider class="mt-5 mb-5"></v-divider>
    </v-container>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-form>
</template>
<script setup lang="ts">
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import ProductService from '../../api/ProductService'
import { ref, onMounted, computed, toRaw } from 'vue'
import { useProductStore } from '@/renderer/store/product_config'

const snackbar: any = ref(false)
const snackbarMessage: any = ref('')
const timeout: any = ref(2000)

// data
const selectedTable: any = ref(null)
const fd1: any = ref({ factor: null, dimension: null })
const fd2: any = ref({ factor: null, dimension: null })
const fd3: any = ref({ factor: null, dimension: null })
const fd4: any = ref({ factor: null, dimension: null })
const factors: any = ref([
  'ANB',
  'GENDER',
  'SMOKER_STATUS',
  'INCOME',
  'SEC',
  'OCC_CLASS',
  'SELECT_PERIOD',
  'EDUCATION',
  'DURATION_IF_M'
])
const selectedTableErrors: any = ref([])

const fd1FactorErrors: any = ref([])
const applicableFactors: any = ref([])

const store = useProductStore()
// computed

const transitions: any = computed(() => {
  const arr = toRaw(store.getProductTransitions)
  console.log('Product Transitions: ', arr)
  return arr
})

onMounted(() => {
  console.log('Product from rating factors')
  ProductService.getRatingFactors().then((result: { data: any }) => {
    factors.value = result.data
  })
})

// validations
const rules = {
  selectedTable: { required },
  fd1: {
    factor: { required },
    dimension: { required }
  }
}

const v$ = useVuelidate(rules, { selectedTable, fd1 })

// methods
const addToRatingFactors = async () => {
  const result = await v$.value.$validate()

  console.log('Result:', result)

  selectedTableErrors.value = []
  fd1FactorErrors.value = []
  if (!selectedTable.value) {
    selectedTableErrors.value.push('A table must be selected')
  }
  if (!fd1.value.factor) {
    fd1FactorErrors.value.push('At least one rating factor must be specified')
  }
  if (selectedTableErrors.value.length === 0 && fd1FactorErrors.value.length === 0) {
    const payload: any = {}
    const factorDimensions = [fd1.value, fd2.value, fd3.value, fd4.value]
    payload.fds = factorDimensions.filter((fd) => fd.factor != null && fd.dimension != null)
    payload.table = selectedTable.value

    // check for duplicates
    const duplicate = applicableFactors.value.find((item: any) => item.table === payload.table)
    if (duplicate) {
      snackbarMessage.value = 'This table has already been added'
      snackbar.value = true
    } else {
      applicableFactors.value.push(payload)
      selectedTable.value = null
      fd1.value = { factor: null, dimension: null }
      fd2.value = { factor: null, dimension: null }
      fd3.value = { factor: null, dimension: null }
      fd4.value = { factor: null, dimension: null }
    }
  }
}

const removeFromList = (table: any) => {
  applicableFactors.value = applicableFactors.value.filter((item: any) => item.table !== table)
}

const validateForm = async () => {
  if (applicableFactors.value.length !== transitions.value.length) {
    snackbarMessage.value = 'Not all applicable rating tables have been configured'
    snackbar.value = true
    return false
  }
  return true
}

defineExpose({
  validateForm
})

// export default {
//   validations: {
//     selectedTable: { required },
//     fd1: {
//       factor: { required },
//       dimension: { required },
//     },
//     applicableFactors: {
//       allFactorsDone: function () {
//         return this.applicableFactors.length === this.transitions.length;
//       },
//     },
//   },
//   watch: {
//     resetValidation: function (val) {
//       if (val) {
//         this.$v.$reset();
//       }
//     },
//   },
//   mounted() {
//     ProductService.getRatingFactors().then((result) => {
//       this.factors = result.data
//     });
//   },
//   methods: {
//     configReset() {
//       this.$v.$reset();
//       this.$store.commit("resetForm", false);
//       this.$emit("formReset", 1);
//     },
//     goBack() {
//       this.$emit("formContinue", 3);
//     },
//     tryContinue() {
//       this.$v.applicableFactors.$touch();
//       if (!this.$v.applicableFactors.$invalid) {
//         this.$emit("formContinue", 5);
//       }
//     },
//     removeFromList(table) {
//       this.$store.commit("removeFromRatingFactors", table);
//     },
//     addToRatingFactors() {
//       this.$v.selectedTable.$touch();
//       this.$v.fd1.factor.$touch();
//       this.$v.fd1.dimension.$touch();
//       if (
//         !this.$v.selectedTable.$invalid &&
//         !this.$v.fd1.factor.$invalid &&
//         !this.$v.fd1.dimension.$invalid
//       ) {
//         const payload = {};
//         const factorDimensions = [this.fd1, this.fd2, this.fd3, this.fd4];
//         payload.fds = factorDimensions.filter(
//           (fd) => fd.factor != null && fd.dimension != null
//         );
//         payload.table = this.selectedTable;
//         this.$store.commit("addToProductRatingFactors", payload);
//         this.selectedTable = null;
//         this.fd1 = { factor: null, dimension: null };
//         this.fd2 = { factor: null, dimension: null };
//         this.fd3 = { factor: null, dimension: null };
//         this.fd4 = { factor: null, dimension: null };
//         this.$v.selectedTable.$reset();
//         this.$v.fd1.factor.$reset();
//         this.$v.fd1.dimension.$reset();
//       }
//     },
//   },
//   computed: {
//     ...mapState({
//       resetValidation: "resetValidation",
//     }),
//     selectedTableErrors() {
//       const errors = [];
//       if (!this.$v.selectedTable.$dirty) return errors;
//       !this.$v.selectedTable.required &&
//         errors.push("A table must be selected");
//       return errors;
//     },
//     fd1FactorErrors() {
//       const errors = [];
//       if (!this.$v.fd1.factor.$dirty) return errors;
//       !this.$v.fd1.factor.required &&
//         errors.push("At least one rating factor must be specified");
//       return errors;
//     },
//     fd1DimensionErrors() {
//       const errors = [];
//       if (!this.$v.fd1.dimension.$dirty) return errors;
//       !this.$v.fd1.dimension.required && errors.push("A value is required");
//       return errors;
//     },
//     applicableFactorsErrors() {
//       const errors = [];
//       if (!this.$v.applicableFactors.$dirty) return errors;
//       !this.$v.applicableFactors.allFactorsDone &&
//         errors.push(
//           "All applicable rating tables must have associated rating factors"
//         );
//       return errors;
//     },
//     transitions() {
//       return this.$store.state.product.productTransitions;
//     },
//     applicableFactors() {
//       return this.$store.state.product.productRatingFactors;
//     },
//   },
// };
</script>

<style scoped>
.trans-tables thead {
  background-color: #38546c;
}

.trans-tables {
  border: 1px solid #38546c;
}
</style>
