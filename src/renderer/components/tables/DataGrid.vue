<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <v-container>
    <v-row v-if="tableTitle">
      <v-col cols="12">
        <h4 style="width: 100%; border-bottom: 1px solid #b4b3b3">{{ tableTitle }} Data</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-btn
          size="small"
          color="primary"
          rounded
          class="custom-btn primary white--text mt-4"
          @click="exportDataCsv"
          >Export to Csv</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <ag-grid-vue
          :enableRangeSelection="enableRangeSelection"
          :enableCharts="enableCharts"
          :statusBar="statusBar"
          style="height: 500px"
          class="ag-theme-quartz"
          :rowData="props.rowData"
          :columnDefs="props.columnDefs"
        >
        </ag-grid-vue>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// import { ref } from 'vue';
import 'ag-grid-community/styles/ag-grid.css' // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css' // Theme
import { AgGridVue } from 'ag-grid-vue3' // Vue Grid Logic

const props = defineProps([
  'rowData',
  'columnDefs',
  'rowModel',
  'pagination',
  'rowSelection',
  'tableTitle',
  'rowCount',
  'tableName',
  'chartTitle',
  'chartXAxisTitle',
  'chartYAxisTitle'
])

const enableRangeSelection = true
const enableCharts = true
const statusBar = {
  statusPanels: [
    { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
    {
      statusPanel: 'agAggregationComponent',
      statusPanelParams: {
        // possible values are: 'count', 'sum', 'min', 'max', 'avg'
        aggFuncs: ['avg', 'sum']
      }
    }
  ]
}

const exportDataCsv = () => {
  // gridApi.exportDataAsCsv({
  //   // suppressQuotes: true,
  //   allColumns: true,
  // });
}
</script>

<style scoped></style>
