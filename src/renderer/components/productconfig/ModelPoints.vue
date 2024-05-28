<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <h4>Selected Model Point variables for {{ product.productName }}</h4>
          <v-list class="multi-column">
            <v-list-item v-for="item in selectVariables" :key="item.id">
              <v-list-item-title class="model-item">{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <!-- <v-divider class="mt-4 mb-4"></v-divider>
      <v-row v-if="selectVariables.length > 0">
        <v-col>
          <v-btn rounded size="small" class="mr-5 accent" @click="createCsv">Create CSV Template</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="selectVariables.length > 0">
        <v-col>
          <v-data-table hide-default-footer calculate-widths disable-pagination :headers="headers"
            class="elevation-1"></v-data-table>
        </v-col>
      </v-row> -->
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ProductService from '../../api/ProductService'
import { useVuelidate } from '@vuelidate/core'
import { useProductStore } from '../../store/product_config'

const store = useProductStore()
const mustContainYear = (value) => {
  let result = false
  value.forEach((element) => {
    if (element.name === 'Year') {
      result = true
    }
  })
  return result
}

const selectVariables: any = ref([])
const product: any = ref(store.product)
const headers: any = ref([])

onMounted(async () => {
  console.log('MOUNTED...')
  const resp = await ProductService.getModelPoints()
  selectVariables.value = resp.data
  selectVariables.value.forEach((item: any) => {
    headers.value.push({ text: item.code, width: 150 })
  })
})

const rules = {
  selectVariables: {
    mustContainYear
  }
}

const v$ = useVuelidate(rules, { selectVariables })

const validateForm = async () => {
  const result = await v$.value.$validate()
  if (!result) {
    v$.value.$errors.forEach((error: any) => {
      console.log(error)
    })
  }
  return result
}

// const createCsv = () => {
//   const columnDelimiter = ','
//   let result = ''
//   let ctr = 0
//   const lineDelimiter = '\n'
//   // build the object
//   const csvObject = {}
//   selectVariables.value.forEach((item) => {
//     csvObject[item.code] = item.type
//   })
//   const keys = Object.keys(csvObject)

//   result += keys.join(columnDelimiter)
//   result += lineDelimiter
//   keys.forEach((key) => {
//     if (ctr > 0) result += columnDelimiter
//     result += csvObject[key]
//     ctr++
//   })
//   result += lineDelimiter
//   const filename = 'export.csv'
//   if (!result.match(/^data:text\/csv/i)) {
//     result = 'data:text/csv;charset=utf-8,' + result
//   }
//   const data = encodeURI(result)

//   const fileLink = document.createElement('a')

//   fileLink.href = data
//   fileLink.setAttribute('download', filename)
//   document.body.appendChild(fileLink)
//   fileLink.click()
// }

defineExpose({
  validateForm
})
</script>
<style scoped>
.multi-column {
  columns: 4;
  border: 1px solid;
  margin: 0;
  padding: 0;
  border-radius: 5px;
}

.multi-column > * {
  display: inline-block;
  width: 100%;
}

.model-item {
  font-size: 13px !important;
}
</style>
