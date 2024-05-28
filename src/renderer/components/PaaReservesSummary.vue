<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="header-title accent white--text mb-2"
            >PAA Reserves Summary</v-card-title
          >
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
                  v-model="selectedPortfolio"
                  variant="outlined"
                  density="compact"
                  clearable
                  placeholder="Select a Portfolio"
                  label="Portfolios"
                  :items="portfolioList"
                  @click:clear="resetSelectedPortfolio"
                  @update:model-value="getReserveSummaryForPortfolio"
                ></v-select>
              </v-col>
              <v-col
                v-if="selectedPortfolio != null && selectedPortfolio !== 'All Portfolios'"
                cols="3"
              >
                <v-select
                  v-model="selectedProduct"
                  variant="outlined"
                  density="compact"
                  clearable
                  placeholder="Select a Product"
                  label="Product"
                  :items="prodlist"
                  @update:model-value="getReserveSummaryForPortfolioProduct"
                ></v-select>
              </v-col>
              <v-col v-if="selectedProduct != null && groupList.length > 0" cols="3">
                <v-select
                  v-model="selectedGroup"
                  variant="outlined"
                  density="compact"
                  clearable
                  placeholder="Select a Group"
                  label="IFRS17 Group"
                  :items="groupList"
                  @update:model-value="getReserveSummaryForPortfolioProductGroup"
                ></v-select>
              </v-col>
            </v-row>
            <loading-indicator :loading-data="loadingData" />
            <v-row v-if="validatePorfolioData()">
              <v-col>
                <data-grid :columnDefs="columnDefs" :rowData="reportData" />
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
import formatValues from '../utils/format_values.js'
import LoadingIndicator from './LoadingIndicator.vue'
import DataGrid from './tables/DataGrid.vue'
// data
const loadingData: any = ref(false)
const selectedRun: any = ref(null)
const selectedProduct: any = ref(null)
const selectedPortfolio: any = ref(null)
const selectedGroup: any = ref(null)
const runList: any = ref([])
const prodlist: any = ref([])
const groupList: any = ref([])
const portfolioList: any = ref([])
const reportData: any = ref([])
const columnDefs: any = ref([])

onMounted(() => {
  DashboardService.getPAAReserveRuns().then((response) => {
    runList.value = response.data.runlist
  })
})

// methods
const validatePorfolioData = () => {
  if (reportData.value !== null && reportData.value.length > 0 && loadingData.value === false) {
    return true
  }
  return false
}

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

const resetSelectedPortfolio = () => {
  console.log('clearing portfolio selection')
  reportData.value = []
  prodlist.value = []
  groupList.value = []
  selectedProduct.value = null
  selectedGroup.value = null
}

const getReserveSummary = () => {
  loadingData.value = true
  portfolioList.value = []
  prodlist.value = []
  groupList.value = []
  DashboardService.getPAAReserveSummaries(selectedRun.value).then((response) => {
    reportData.value = response.data.items
    portfolioList.value = response.data.portfolios
    portfolioList.value.unshift('All Portfolios')
    selectedPortfolio.value = 'All Portfolios'

    createColumnDefs(reportData.value)
    loadingData.value = false
  })
}

const getReserveSummaryForPortfolio = () => {
  if (selectedPortfolio.value !== null) {
    if (selectedPortfolio.value !== 'All Portfolios') {
      loadingData.value = true
      DashboardService.getPAAReserveSummariesForPortfolio(
        selectedRun.value,
        selectedPortfolio.value
      ).then((response) => {
        reportData.value = response.data.items
        if (reportData.value.length > 0) {
          console.log(reportData.value)
          prodlist.value = response.data.products
          prodlist.value.unshift('All Products')
          selectedProduct.value = 'All Products'
          createColumnDefs(reportData.value)
        }
        loadingData.value = false
      })
    } else {
      getReserveSummary()
    }
  }
}

const getReserveSummaryForPortfolioProduct = () => {
  if (selectedProduct.value !== null) {
    if (selectedProduct.value !== 'All Products') {
      loadingData.value = true
      DashboardService.getPAAReserveSummariesForPortfolioProduct(
        selectedRun.value,
        selectedPortfolio.value,
        selectedProduct.value
      ).then((response) => {
        reportData.value = response.data.items
        if (reportData.value.length > 0) {
          console.log(reportData.value)
          groupList.value = response.data.groups
          groupList.value.unshift('All Groups')
          selectedGroup.value = 'All Groups'

          createColumnDefs(reportData.value)
        }
        loadingData.value = false
      })
    } else {
      getReserveSummaryForPortfolio()
    }
  }
}

const getReserveSummaryForPortfolioProductGroup = () => {
  if (selectedGroup.value !== 'All Groups') {
    loadingData.value = true
    DashboardService.getPAAReserveSummariesForPortfolioProductGroup(
      selectedRun.value,
      selectedPortfolio.value,
      selectedProduct.value,
      selectedGroup.value
    ).then((response) => {
      reportData.value = response.data.items
      if (reportData.value.length > 0) {
        console.log(reportData.value)
        createColumnDefs(reportData.value)
      }
      loadingData.value = false
    })
  } else {
    getReserveSummaryForPortfolioProduct()
  }
}

const createColumnDefs = (data) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 150

    columnDefs.value.push(header)
  })
}
</script>

<style></style>
