<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="3" class="rounded-lg">
          <v-card-title class="mb-4 header-title accent white--text"
            >Upload Assumption Tables</v-card-title
          >
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-table>
                    <tbody>
                      <tr v-for="item in globalTables" :key="item.name">
                        <td style="width: 70%">{{ item.name }}</td>
                        <td style="text-align: center">
                          <v-btn depressed rounded size="small" @click.stop="viewTable(item)">
                            <v-icon left color="primary">mdi-information</v-icon>
                            <span>Info</span>
                          </v-btn>
                        </td>
                        <td style="text-align: center">
                          <bulk-file-updater :tableType="item.name"></bulk-file-updater>
                        </td>
                        <td style="text-align: center">
                          <v-btn depressed rounded size="small" @click.stop="confirmDelete(item)">
                            <v-icon color="error">mdi-delete</v-icon>
                            <span>Delete</span>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
              <v-row v-if="globalTableData.length > 0 && !loadingData">
                <v-col>
                  <data-grid
                    :columnDefs="columnDefs"
                    :rowData="globalTableData"
                    :table-title="selectedTable"
                    :pagination="true"
                    :rowCount="rowCount"
                  />
                </v-col>
              </v-row>
              <v-row v-if="loadingData">
                <v-col>
                  <p class="mt-3">Loading...</p>
                  <v-progress-linear
                    buffer-value="20"
                    color="primary"
                    stream
                    value="10"
                  ></v-progress-linear>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ text }}
      <v-btn rounded color="red" variant="text" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline"
          ><v-icon class="mr-3" color="red" size="25">mdi-alert-circle</v-icon>Delete
          Confirmation</v-card-title
        >
        <v-card-text>Are you sure you want to delete data from {{ selectedTable }} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="text" @click="dialog = false">No</v-btn>
          <v-btn
            color="primary darken-1"
            variant="text"
            @click="deleteGlobalTableData(selectedTable)"
            >Yes</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="yieldCurveDataDialog" persistent max-width="600">
      <v-card>
        <v-card-title class="header-title accent white--text">Select Yield Curve data</v-card-title>
        <v-card-text
          ><v-row v-if="yieldCurveYears.length > 0" class="mt-5">
            <v-col>
              <v-select
                v-model="selectedYieldCurveYear"
                outlined
                dense
                label="Yield Curve Year"
                :items="yieldCurveYears"
                item-title="Year"
                item-value="Year"
                @update:model-value="getYieldCurveCodes"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="yieldCurveCodes.length > 0">
            <v-col>
              <v-select
                v-model="selectedYieldCurveCode"
                outlined
                dense
                placeholder="Select an existing Yield Curve Code"
                label="Yield Curve Code"
                :items="yieldCurveCodes"
                @update:model-value="getYieldCurveMonths"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="yieldCurveMonths.length > 0">
            <v-col>
              <v-select
                v-model="selectedYieldCurveMonth"
                outlined
                dense
                placeholder="Select an existing Yield Curve Month"
                label="Yield Curve Month"
                :items="yieldCurveMonths"
              ></v-select>
            </v-col>
          </v-row>
          <v-row v-if="selectedYieldCurveMonth !== null">
            <v-col>
              <p
                >Clicking on Proceed will delete any available Yield curve data for the selected
                criteria</p
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" variant="text" @click="deleteYieldCurveData()"
            >Proceed</v-btn
          >

          <v-btn color="primary darken-1" variant="text" @click="clearYieldDialog()">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import ProductService from '../api/ProductService'
import ValuationService from '../api/ValuationService'
import formatValues from '../utils/format_values'
import DataGrid from '../components/tables/DataGrid.vue'
import BulkFileUpdater from '../components/BulkFileUpdater.vue'
import { ref } from 'vue'

// data
const selectedYieldCurveYear: any = ref(null)
const selectedYieldCurveCode: any = ref(null)
const selectedYieldCurveMonth: any = ref(null)
const yieldCurveMonths: any = ref([])
const yieldCurveCodes: any = ref([])
const yieldCurveYears: any = ref([])
// const file: any = ref(null);
// const selectedType: any = ref(null);
// const uploadSuccess: any = ref(false);
// const loading: any = ref(false);
const loadingData: any = ref(false)
const rowCount: any = ref(0)
// const availableTypes: any = ref([
//   { name: "Margins" },
//   { name: "Parameters" },
//   { name: "Yield Curve" },
//   { name: "Shocks" },
// ]);
const timeout: any = ref(3000)
// const shocksData: any = ref([]);
// const yieldCurveData: any = ref([]);
// const marginsData: any = ref([]);
// const parametersData: any = ref([]);
const globalTableData: any = ref([])
const selectedTable: any = ref('')
const globalTables: any = ref([
  { name: 'Parameters' },
  { name: 'Yield Curve' },
  { name: 'Margins' },
  { name: 'Shocks' }
])
const snackbar: any = ref(false)
const text: any = ref('')
// const tableDialog: any = ref(false);
const yieldCurveDataDialog: any = ref(false)
// const tableData: any = ref([]);
const columnDefs: any = ref([])
// const rowData: any = ref([]);
const dialog: any = ref(false)

// methods
const deleteYieldCurveData = () => {
  ProductService.deleteYieldCurveData(
    selectedYieldCurveYear,
    selectedYieldCurveCode,
    selectedYieldCurveMonth
  ).then(() => {
    text.value = 'yield curve data deleted successfully'
    snackbar.value = true
    clearYieldDialog()
  })
}

const clearYieldDialog = () => {
  selectedYieldCurveYear.value = null
  selectedYieldCurveCode.value = null
  selectedYieldCurveMonth.value = null
  yieldCurveMonths.value = []
  yieldCurveCodes.value = []
  yieldCurveDataDialog.value = false
}

const getYieldCurveCodes = () => {
  ProductService.getYieldCurveCodes(selectedYieldCurveYear).then((response) => {
    yieldCurveCodes.value = response.data
  })
}

const getYieldCurveMonths = () => {
  ProductService.getYieldCurveMonths(selectedYieldCurveYear, selectedYieldCurveCode).then(
    (response) => {
      yieldCurveMonths.value = response.data
    }
  )
}

const getYieldCurveYears = () => {
  ValuationService.getAvailableYieldYears().then((response) => {
    yieldCurveYears.value = response.data
    if (yieldCurveYears.value === null) {
      yieldCurveYears.value = []
    }
  })
}

const confirmDelete = (item: any) => {
  if (item.name === 'Yield Curve') {
    getYieldCurveYears()
    if (yieldCurveYears.value.length > 0) {
      yieldCurveDataDialog.value = true
    }
  } else {
    selectedTable.value = item.name
    dialog.value = true
  }
}

const deleteGlobalTableData = (table: any) => {
  ProductService.deleteGlobalTableData(table).then((response) => {
    text.value = response.data
    snackbar.value = true
    dialog.value = false
    globalTableData.value = []
    selectedTable.value = ''
  })
}

const viewTable = (item: any) => {
  loadingData.value = true
  globalTableData.value = []
  ProductService.getGlobalTableData(item.name)
    .then((response) => {
      console.log(response.data.data)
      if (response.data.data === null) {
        response.data.data = []
      }

      if (response.data.data.length === 0) {
        text.value = 'No data available for this table'
        snackbar.value = true
      } else {
        globalTableData.value = response.data.data
        rowCount.value = response.data.row_count
        selectedTable.value = item.name
        createColumnDefs(globalTableData.value)
      }
      loadingData.value = false
    })
    .catch(() => {
      loadingData.value = false
    })
}

const createColumnDefs = (data: any) => {
  columnDefs.value = []
  Object.keys(data[0]).forEach((element) => {
    const header: any = {}
    header.headerName = element
    header.field = element
    header.valueFormatter = formatValues
    header.minWidth = 200
    columnDefs.value.push(header)
  })
}

// const uploadFile = () => {
//   if (selectedType.value !== null && file.value !== null) {
//     loading.value = true;
//     const formdata = new FormData();
//     formdata.append("file", file.value);
//     formdata.append("assumption_type", selectedType.value);
//     ProductService.uploadBulkAssumptions({ formdata })
//       .then((res) => {
//         if (res.status === 200) {
//           file.value = null;
//           selectedType.value = null;
//           text.value = "The data has been successfully updated";
//           timeout.value = 3000;
//           snackbar.value = true;
//           loading.value = false;
//         }
//       })
//       .catch(() => {
//         loading.value = false;
//       });
//   }
// };

// export default {
//   components: {
//     TablesDataGridTable2,
//     BulkFileUpdater,
//   },
//   data() {
//     return {
//       selectedYieldCurveYear: null,
//       selectedYieldCurveCode: null,
//       selectedYieldCurveMonth: null,
//       yieldCurveMonths: [],
//       yieldCurveCodes: [],
//       yieldCurveYears: [],
//       file: null,
//       selectedType: null,
//       uploadSuccess: false,
//       loading: false,
//       loadingData: false,
//       rowCount: 0,
//       availableTypes: [
//         { name: "Margins" },
//         { name: "Parameters" },
//         { name: "Yield Curve" },
//         { name: "Shocks" },
//       ],
//       timeout: 3000,
//       shocksData: [],
//       yieldCurveData: [],
//       marginsData: [],
//       parametersData: [],
//       globalTableData: [],
//       selectedTable: "",
//       globalTables: [
//         { name: "Parameters" },
//         { name: "Yield Curve" },
//         { name: "Margins" },
//         { name: "Shocks" },
//       ],
//       snackbar: false,
//       text: "",
//       tableDialog: false,
//       yieldCurveDataDialog: false,
//       tableData: [],
//       columnDefs: [],
//       rowData: [],
//       dialog: false,
//     };
//   },
//   mounted() {
//     // ProductService.getGlobalTables().then((response) => {
//     //   this.globalTables = response.data;
//     // });
//     this.getYieldCurveYears();
//   },
//   methods: {
//     deleteYieldCurveData() {
//       ProductService.deleteYieldCurveData(
//         this.selectedYieldCurveYear,
//         this.selectedYieldCurveCode,
//         this.selectedYieldCurveMonth
//       ).then(() => {
//         this.text = "yield curve data deleted successfully";
//         this.snackbar = true;
//         this.clearYieldDialog();
//       });
//     },
//     clearYieldDialog() {
//       this.selectedYieldCurveYear = null;
//       this.selectedYieldCurveCode = null;
//       this.selectedYieldCurveMonth = null;
//       this.yieldCurveMonths = [];
//       this.yieldCurveCodes = [];
//       this.yieldCurveDataDialog = false;
//     },
//     getYieldCurveCodes() {
//       ProductService.getYieldCurveCodes(this.selectedYieldCurveYear).then(
//         (response) => {
//           this.yieldCurveCodes = response.data;
//         }
//       );
//     },
//     getYieldCurveMonths() {
//       ProductService.getYieldCurveMonths(
//         this.selectedYieldCurveYear,
//         this.selectedYieldCurveCode
//       ).then((response) => {
//         this.yieldCurveMonths = response.data;
//       });
//     },
//     getYieldCurveYears() {
//       ValuationService.getAvailableYieldYears().then((response) => {
//         this.yieldCurveYears = response.data;
//         if (this.yieldCurveYears === null) {
//           this.yieldCurveYears = [];
//         }
//       });
//     },
//     confirmDelete(item) {
//       if (item.name === "Yield Curve") {
//         this.getYieldCurveYears();
//         if (this.yieldCurveYears.length > 0) {
//           this.yieldCurveDataDialog = true;
//         }

//       } else {
//         this.selectedTable = item.name;
//         this.dialog = true;
//       }
//     },
//     deleteGlobalTableData(table) {
//       ProductService.deleteGlobalTableData(table).then((response) => {
//         this.text = response.data;
//         this.snackbar = true;
//         this.dialog = false;
//         this.globalTableData = [];
//         this.selectedTable = "";
//       });
//     },

//     viewTable(item) {
//       this.loadingData = true;
//       this.globalTableData = [];
//       ProductService.getGlobalTableData(item.name).then((response) => {
//         console.log(response.data.data);
//         if (response.data.data === null) {
//           response.data.data = [];
//         }

//         if (response.data.data.length === 0) {
//           this.text = "No data available for this table";
//           this.snackbar = true;
//         } else {
//           this.globalTableData = response.data.data;
//           this.rowCount = response.data.row_count;
//           this.selectedTable = item.name;
//           this.createColumnDefs(this.globalTableData);

//         }

//         this.loadingData = false;
//       }).catch(() => {
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
//         header.minWidth = 200;
//         this.columnDefs.push(header);
//       });
//     },

//     uploadFile() {
//       if (this.selectedType !== null && this.file !== null) {
//         this.loading = true;
//         const formdata = new FormData();
//         formdata.append("file", this.file);
//         formdata.append("assumption_type", this.selectedType);
//         ProductService.uploadBulkAssumptions({ formdata })
//           .then((res) => {
//             if (res.status === 200) {
//               this.file = null;
//               this.selectedType = null;
//               this.text = "The data has been successfully updated";
//               this.timeout = 3000;
//               this.snackbar = true;
//               this.loading = false;
//             }
//           })
//           .catch(() => {
//             this.loading = false;
//           });
//       }
//     },
//   },
// };
</script>
