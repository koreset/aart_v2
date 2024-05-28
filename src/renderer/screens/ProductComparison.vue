<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="rounded-lg">
          <v-card-title class="header-title accent white--text">Cash Flow Comparison</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-select v-model="productA" variant="outlined" density="compact" :items="allProducts"
                    item-text="product_name" item-value="product_code" label="Product A" @change="getJobsA"></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select v-model="productB" variant="outlined" density="compact" :items="allProducts"
                    item-text="product_name" item-value="product_code" label="Product B" @change="getJobsB"></v-select>
                </v-col>
              </v-row>
              <v-row v-if="productA !== null && productB !== null">
                <v-col cols="6">
                  <v-select v-model="selectedJobA" variant="outlined" density="compact" :items="jobsA"
                    item-text="run_name" return-object label="Available jobs for Product A" @change="getJobsA"></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select v-model="selectedJobB" variant="outlined" density="compact" :items="jobsB"
                    item-text="run_name" return-object label="Available jobs for Product B" @change="getJobsB"></v-select>
                </v-col>
              </v-row>
              <v-row v-if="selectedJobA !== null && selectedJobB !== null">
                <v-col cols="8">
                  <v-select v-model="selectedVariable" variant="outlined" density="compact" :items="variableItems"
                    label="Select a Run Variable for comparison"></v-select>
                </v-col>
                <v-col cols="4">
                  <v-btn rounded class="primary" @click="startComparison">Go</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-row v-if="resultData.length > 0">
      <v-col>
        <tables-ibnr-data-table :chartTitle="'CashflowA vs. CashflowB'" :tableTitle="selectedVariable"
          :chartXAxisTitle="'Projection Month'" :columnDefs="cDefs" :rowData="resultData" :pagination="true" />
      </v-col>
    </v-row> -->
    <!-- <v-row v-if="requestStarted">
      <v-col>
        <v-card :loading="loading">
          <v-card-text v-if="responseReceived">
            <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
          </v-card-text>
          <v-card-text v-else>Processing Request ...</v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>
<script setup lang="ts">
import ValuationService from "../api/ValuationService";
import formatValues from "../utils/format_values";
import { ref } from "vue";
// data
const productA: any = ref(null);
const productB: any = ref(null);
const selectedJobA: any = ref(null);
const selectedJobB: any = ref(null);
const selectedVariable: any = ref(null);
const resultData: any = ref([]);
const cDefs: any = ref([]);
const loading: any = ref(false);
const requestStarted: any = ref(false);
const responseReceived: any = ref(false);
const jobsA: any = ref([]);
const jobsB: any = ref([]);
const variableItems: any = ref([
  "InitialPolicy",
  "InitialPolicyAdjusted",
  "TotalIncrementalNaturalDeaths",
  "TotalIncrementalNaturalDeathsAdjusted",
  "TotalIncrementalLapses",
  "TotalIncrementalLapsesAdjusted",
  "TotalIncrementalAccidentalDeaths",
  "TotalIncrementalAccidentalDeathsAdjusted",
  "PremiumIncome",
  "PremiumIncomeAdjusted",
  "Commission",
  "CommissionAdjusted",
  "RenewalCommission",
  "RenewalCommissionAdjusted",
  "DeathOutgo",
  "DeathOutgoAdjusted",
  "NonLifeClaimsOutgo",
  "NonLifeClaimsOutgoAdjusted",
  "InitialExpenses",
  "InitialExpensesAdjusted",
  "RenewalExpenses",
  "RenewalExpensesAdjusted",
  "NetCashFlow",
  "NetCashFlowAdjusted",
  "Reserves",
  "ReservesAdjusted",
  "Profit",
  "ProfitAdjusted",
]);
// const updateArgs: any = ref([true, true, { duration: 1000 }]);
const chartOptions: any = ref({
  credits: {
    enabled: false,
  },
  chart: {
    type: "spline",
  },
  title: {
    text: "",
  },
  xAxis: {
    categories: [],
    title: { text: "Projection Month" },
  },
  yAxis: {
    title: {
      text: "Reserves",
    },
  },
  series: [],
});

// methods
const startComparison = () => {
  requestStarted.value = true;
  responseReceived.value = false;
  loading.value = true;
  const camelToSnakeCase = (str: string) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  let variable = camelToSnakeCase(selectedVariable.value);
  if (variable[0] === "_") {
    variable = variable.substring(1);
  }

  getAggregatedVariable({ variable });
};

const getJobProductId = (job: any, prodCode: any) => {
  const p = job.products.filter((item: any) => item.product_code === prodCode);
  return p[0].id;
};

const combineArrays = (array1: any, array2: any) => {
  const combinedArray = array1.map((item1: any) => {
    const correspondingItem = array2.find(
      (item2: any) => item2.projection_month === item1.projection_month
    );
    console.log(item1, correspondingItem);

    if (correspondingItem) {
      return {
        projection_month: item1.projection_month,
        cashflowA: item1.reserves,
        cashflowB: correspondingItem.reserves,
      };
    }

    return null; // Handle cases where a matching projectionMonth is not found in array2
  });
  console.log(combinedArray);
  // sort array on the projection_month
  combinedArray.sort((a: any, b: any) => {
    return a.projection_month - b.projection_month;
  });
  return combinedArray;
};

const getAggregatedVariable = (payload: any) => {
  const jobProductIdA = getJobProductId(selectedJobA.value, productA.value);
  const jobProductIdB = getJobProductId(selectedJobB.value, productB.value);
  payload.jobProductIds = [jobProductIdA, jobProductIdB];
  payload.monthRange = 400;
  payload.jobIds = true;
  ValuationService.getReserves(payload).then((response: any) => {
    const recentJob = response.data;

    const allReserves = recentJob.all_aggregated_reserves;
    const reserves1 = allReserves[0].aggregated_reserves;
    const reserves2 = allReserves[1].aggregated_reserves;
    resultData.value = [];
    cDefs.value = [];
    resultData.value = combineArrays(reserves1, reserves2);
    cDefs.value = createColumnDefs(resultData.value[0]);

    chartOptions.value.series = [];
    allReserves.forEach((reserves: any, index: any) => {
      const chartSeries: any = {};
      chartSeries.data = [];
      reserves.aggregated_reserves.forEach((elem: any) => {
        if (
          chartOptions.value.xAxis.categories.indexOf(
            elem.projection_month
          ) === -1
        ) {
          chartOptions.value.xAxis.categories.push(elem.projection_month);
        }
        chartSeries.data.push(elem.reserves);
      });
      console.log("chart series: ", chartSeries.data);
      chartSeries.name = reserves.projection_job.product_code + " [" + (index + 1) + "]";
      chartSeries.color =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      chartOptions.value.series.push(chartSeries);
      chartOptions.value.yAxis.title.text = selectedVariable.value;
    });
    responseReceived.value = true;
    loading.value = false;
  });
};

const getJobsA = () => {
  jobsA.value = [];
  ValuationService.getJobsForProduct(productA.value).then((resp: any) => {
    jobsA.value = resp.data;
  });
};

const getJobsB = () => {
  jobsB.value = [];
  ValuationService.getJobsForProduct(productB.value).then((resp: any) => {
    jobsB.value = resp.data;
  });
};

const createColumnDefs = (data: any) => {
  const cDefs: any = [];
  if (typeof data !== "undefined") {
    Object.keys(data).forEach((element) => {
      const column: any = {};
      if (element === 'projection_month') {
        column.headerName = element;
        column.field = element;
        column.chartDataType = 'category';
        column.minWidth = 150;
        // column.valueFormatter = formatValues;
      } else {
        column.headerName = element;
        column.field = element;
        column.chartDataType = 'series';
        column.valueFormatter = formatValues;
        column.minWidth = 150;

      }
      cDefs.push(column);

    });
  }
  return cDefs;
};

// computed
const allProducts = ref([]);


// export default {
//   name: "ProductComparison",
//   data: () => ({
//     loading: false,
//     requestStarted: false,
//     responseReceived: false,
//     productA: null,
//     productB: null,
//     jobsA: [],
//     jobsB: [],
//     selectedJobA: null,
//     selectedJobB: null,
//     selectedVariable: null,
//     resultData: [],
//     cDefs: [],
//     variableItems: [
//       "InitialPolicy",
//       "InitialPolicyAdjusted",
//       "TotalIncrementalNaturalDeaths",
//       "TotalIncrementalNaturalDeathsAdjusted",
//       "TotalIncrementalLapses",
//       "TotalIncrementalLapsesAdjusted",
//       "TotalIncrementalAccidentalDeaths",
//       "TotalIncrementalAccidentalDeathsAdjusted",
//       "PremiumIncome",
//       "PremiumIncomeAdjusted",
//       "Commission",
//       "CommissionAdjusted",
//       "RenewalCommission",
//       "RenewalCommissionAdjusted",
//       "DeathOutgo",
//       "DeathOutgoAdjusted",
//       "NonLifeClaimsOutgo",
//       "NonLifeClaimsOutgoAdjusted",
//       "InitialExpenses",
//       "InitialExpensesAdjusted",
//       "RenewalExpenses",
//       "RenewalExpensesAdjusted",
//       "NetCashFlow",
//       "NetCashFlowAdjusted",
//       "Reserves",
//       "ReservesAdjusted",
//       "Profit",
//       "ProfitAdjusted",
//     ],
//     updateArgs: [true, true, { duration: 1000 }],
//     chartOptions: {
//       credits: {
//         enabled: false,
//       },
//       chart: {
//         type: "spline",
//       },
//       title: {
//         text: "",
//       },
//       xAxis: {
//         categories: [],
//         title: { text: "Projection Month" },
//       },
//       yAxis: {
//         title: {
//           text: "Reserves",
//         },
//       },
//       series: [],
//     },
//   }),
//   methods: {
//     startComparison() {
//       this.requestStarted = true;
//       this.responseReceived = false;
//       this.loading = true;
//       const camelToSnakeCase = (str) =>
//         str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

//       let variable = camelToSnakeCase(this.selectedVariable);
//       if (variable[0] === "_") {
//         variable = variable.substring(1);
//       }

//       this.getAggregatedVariable({ variable });
//     },
//     getJobProductId(job, prodCode) {
//       const p = job.products.filter((item) => item.product_code === prodCode);
//       return p[0].id;
//     },
//     combineArrays(array1, array2) {
//       const combinedArray = array1.map((item1) => {
//         const correspondingItem = array2.find((item2) => item2.projection_month === item1.projection_month);
//         console.log(item1, correspondingItem)

//         if (correspondingItem) {
//           return {
//             projection_month: item1.projection_month,
//             cashflowA: item1.reserves,
//             cashflowB: correspondingItem.reserves,
//           };
//         }

//         return null; // Handle cases where a matching projectionMonth is not found in array2
//       });
//       console.log(combinedArray);
//       // sort array on the projection_month
//       combinedArray.sort((a, b) => {
//         return a.projection_month - b.projection_month;
//       });
//       return combinedArray
//     },
//     getAggregatedVariable(payload) {
//       const jobProductIdA = this.getJobProductId(
//         this.selectedJobA,
//         this.productA
//       );
//       const jobProductIdB = this.getJobProductId(
//         this.selectedJobB,
//         this.productB
//       );
//       payload.jobProductIds = [jobProductIdA, jobProductIdB];
//       payload.monthRange = 400;
//       payload.jobIds = true;
//       ValuationService.getReserves(payload).then((response) => {
//         this.recentJob = response.data;

//         const allReserves = this.recentJob.all_aggregated_reserves;
//         const reserves1 = allReserves[0].aggregated_reserves;
//         const reserves2 = allReserves[1].aggregated_reserves;
//         this.resultData = [];
//         this.cDefs = [];
//         this.resultData = this.combineArrays(reserves1, reserves2);
//         this.cDefs = this.createColumnDefs(this.resultData[0]);

//         this.chartOptions.series = [];
//         allReserves.forEach((reserves, index) => {
//           const chartSeries = {};
//           chartSeries.data = [];
//           reserves.aggregated_reserves.forEach((elem) => {
//             if (
//               this.chartOptions.xAxis.categories.indexOf(
//                 elem.projection_month
//               ) === -1
//             ) {
//               this.chartOptions.xAxis.categories.push(elem.projection_month);
//             }
//             chartSeries.data.push(elem.reserves);
//           });
//           console.log("chart series: ", chartSeries.data)
//           chartSeries.name = reserves.projection_job.product_code + " [" + (index + 1) + "]";
//           chartSeries.color =
//             "#" + Math.floor(Math.random() * 16777215).toString(16);
//           this.chartOptions.series.push(chartSeries);
//           this.chartOptions.yAxis.title.text = this.selectedVariable;
//         });
//         this.responseReceived = true;
//         this.loading = false;
//       });
//     },
//     getJobsA() {
//       this.jobsA = [];
//       ValuationService.getJobsForProduct(this.productA).then((resp) => {
//         this.jobsA = resp.data;
//       });
//     },
//     getJobsB() {
//       this.jobsB = [];
//       ValuationService.getJobsForProduct(this.productB).then((resp) => {
//         this.jobsB = resp.data;
//       });
//     },
//     createColumnDefs(data) {
//       const cDefs = [];
//       if (typeof data !== "undefined") {
//         Object.keys(data).forEach((element) => {
//           const column = {};
//           if (element == 'projection_month') {
//             column.headerName = element;
//             column.field = element;
//             column.chartDataType = 'category';
//             column.minWidth = 150;
//             // column.valueFormatter = formatValues;
//           } else {
//             column.headerName = element;
//             column.field = element;
//             column.chartDataType = 'series';
//             column.valueFormatter = formatValues;
//             column.minWidth = 150;

//           }
//           cDefs.push(column);

//         });
//       }
//       return cDefs;
//     },

//   },
//   computed: {
//     allProducts() {
//       const products = [];
//       this.$store.state.productFamilies.forEach((family) => {
//         family.products.forEach((product) => {
//           products.push(product);
//         });
//       });
//       return products;
//     },
//   },
// };
</script>

