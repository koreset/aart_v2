<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="header-title accent white--text mb-2">Reserves Summary</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-select
                  v-model="selectedRun"
                  variant="outlined"
                  density="compact"
                  placeholder="Select a Run Date"
                  label="Run Date"
                  :items="runList"
                  item-title="run_date"
                  item-value="run_date"
                  @update:model-value="getReserveSummary"
                ></v-select>
              </v-col>
              <v-col v-if="selectedRun != null" cols="3">
                <v-select
                  v-model="selectedProduct"
                  variant="outlined"
                  density="compact"
                  clearable
                  placeholder="Select a Product"
                  label="Product"
                  :items="prodlist"
                  @update:model-value="getReserveSummaryForProduct"
                ></v-select>
              </v-col>
              <v-col v-if="validateProductData()" cols="3">
                <v-select
                  v-model="selectedBasis"
                  variant="outlined"
                  clearable
                  density="compact"
                  placeholder="Select a Run Basis"
                  label="Run Basis"
                  :items="bases"
                  @update:model-value="getReserveSummaryForProductAndBasis"
                ></v-select>
              </v-col>

              <v-col v-if="selectedBasis != null" cols="3">
                <v-select
                  v-model="selectedSpCode"
                  variant="outlined"
                  density="compact"
                  clearable
                  placeholder="Select a SP Code"
                  label="SP Code"
                  :items="spCodes"
                  @update:model-value="getReserveSummaryForProductBasisAndSpCode"
                ></v-select>
              </v-col>
            </v-row>
            <loading-indicator :loading-data="loadingData" />
            <v-row v-if="reportData.length > 0 && !loadingData">
              <v-col>
                <data-grid :column-defs="columnDefs" :row-data="reportData" />
              </v-col>
            </v-row>
            <v-row v-if="validateReportData()">
              <v-col>
                <p>No data available.</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardService from '../api/DashboardService.js'
import { formatValues } from '../utils/format_values.js'
import LoadingIndicator from './LoadingIndicator.vue'
import DataGrid from './tables/DataGrid.vue'
// data
const loadingData: any = ref(false)
const selectedRun: any = ref(null)
const selectedProduct: any = ref(null)
const selectedSpCode: any = ref(null)
const selectedBasis: any = ref(null)
const bases: any = ref([])
const spCodes: any = ref([])
const runList: any = ref([])
const prodlist: any = ref([])
const reportData: any = ref([])
const columnDefs: any = ref([])

onMounted(() => {
  DashboardService.getReserveRuns().then((response) => {
    runList.value = response.data.runlist
  })
})

const validateReportData = () => {
  if (
    reportData.value.length === 0 &&
    selectedProduct.value !== null &&
    loadingData.value === false
  ) {
    return true
  }
  return false
}

const validateProductData = () => {
  if (
    selectedProduct.value != null &&
    selectedProduct.value !== 'All Products' &&
    validateReportData() === false
  ) {
    return true
  }
  return false
}

const getReserveSummary = () => {
  loadingData.value = true
  DashboardService.getReserveSummaries(selectedRun.value).then((response) => {
    reportData.value = response.data.items
    prodlist.value = response.data.prodlist
    prodlist.value.unshift('All Products')
    selectedProduct.value = 'All Products'

    createColumnDefs(reportData.value)
    loadingData.value = false
  })
}

const getReserveSummaryForProduct = () => {
  if (selectedProduct.value !== 'All Products') {
    loadingData.value = true
    DashboardService.getReserveSummariesForProduct(selectedRun.value, selectedProduct.value).then(
      (response) => {
        reportData.value = response.data.items
        if (reportData.value.length > 0) {
          console.log(reportData.value)
          bases.value = response.data.bases
          createColumnDefs(reportData.value)
        }
        loadingData.value = false
      }
    )
  } else {
    getReserveSummary()
  }
}

const getReserveSummaryForProductBasisAndSpCode = () => {
  loadingData.value = true
  DashboardService.getReserveSummariesForProductBasisAndSpCode(
    selectedRun.value,
    selectedProduct.value,
    selectedBasis.value,
    selectedSpCode.value
  ).then((response) => {
    console.log('Response data:', response.data)
    reportData.value = response.data.items
    createColumnDefs(reportData.value)
    loadingData.value = false
  })
}

const getReserveSummaryForProductAndBasis = () => {
  loadingData.value = true
  DashboardService.getReserveSummariesForProductAndBasis(
    selectedRun.value,
    selectedProduct.value,
    selectedBasis.value
  ).then((response) => {
    console.log(response.data)
    reportData.value = response.data.items
    spCodes.value = response.data.spcodes
    createColumnDefs(reportData.value)
    loadingData.value = false
  })
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element: any) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 150
    columnDefs.value.push(header)
  })
}

// export default {
//   data() {
//     return {
//       loadingData: false,
//       selectedRun: null,
//       selectedProduct: null,
//       selectedSpCode: null,
//       selectedBasis: null,
//       bases: [],
//       spCodes: [],
//       runList: [],
//       prodlist: [],
//       reportData: [],
//       columnDefs: [],
//     };
//   },
//   mounted() {
//     DashboardService.getReserveRuns().then((response) => {
//       this.runList = response.data.runlist;
//     });
//   },
//   methods: {
//     validateReportData() {
//       if (this.reportData.length === 0 && this.selectedProduct !== null && this.loadingData === false) {
//         return true;
//       }
//       return false;

//     },
//     validateProductData() {
//       if (this.selectedProduct != null && this.selectedProduct !== 'All Products' && this.validateReportData() === false) {
//         return true;
//       }
//       return false;
//     },

//     getReserveSummary() {
//       this.loadingData = true;
//       DashboardService.getReserveSummaries(this.selectedRun).then(
//         (response) => {
//           this.reportData = response.data.items;
//           this.prodlist = response.data.prodlist;
//           this.prodlist.unshift("All Products");
//           this.selectedProduct = "All Products";

//           this.createColumnDefs(this.reportData);
//           this.loadingData = false;
//         }
//       );
//     },
//     getReserveSummaryForProduct() {
//       if (this.selectedProduct !== "All Products") {
//         this.loadingData = true;
//         DashboardService.getReserveSummariesForProduct(
//           this.selectedRun,
//           this.selectedProduct
//         ).then((response) => {
//           this.reportData = response.data.items;
//           if (this.reportData.length > 0) {
//             console.log(this.reportData)
//             this.bases = response.data.bases;
//             this.createColumnDefs(this.reportData);
//           }
//           this.loadingData = false;
//         });
//       } else {
//         this.getReserveSummary();
//       }
//     },
//     getReserveSummaryForProductBasisAndSpCode() {
//       this.loadingData = true;
//       DashboardService.getReserveSummariesForProductBasisAndSpCode(
//         this.selectedRun,
//         this.selectedProduct,
//         this.selectedBasis,
//         this.selectedSpCode
//       ).then((response) => {
//         console.log("Response data:", response.data)
//         this.reportData = response.data.items;
//         this.createColumnDefs(this.reportData);
//         this.loadingData = false;
//       });
//     },
//     getReserveSummaryForProductAndBasis() {
//       this.loadingData = true;
//       DashboardService.getReserveSummariesForProductAndBasis(
//         this.selectedRun,
//         this.selectedProduct,
//         this.selectedBasis
//       ).then((response) => {
//         console.log(response.data)
//         this.reportData = response.data.items;
//         this.spCodes = response.data.spcodes;
//         this.createColumnDefs(this.reportData);
//         this.loadingData = false;
//       });
//     },

//     createColumnDefs(data) {
//       this.columnDefs = [];
//       Object.keys(data[0]).forEach((element) => {
//         const header = {};
//         header.headerName = element;
//         header.field = element;
//         header.valueFormatter = formatValues;
//         header.minWidth = 150;
//         this.columnDefs.push(header);
//       });
//     },
//   },
// };
</script>

<style></style>
