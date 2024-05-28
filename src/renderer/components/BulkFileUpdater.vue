<template>
  <v-dialog v-model="dialog" persistent max-width="550px">
    <template #activator="{ props }">
      <v-btn depressed rounded size="small" v-bind="props">
        <v-icon color="accent">mdi-file-upload</v-icon>
        <span>Upload</span>
      </v-btn>
    </template>
    <v-card v-if="!uploadSuccess" class="rounded-lg">
      <v-card-title class="header-title accent white--text mb-4"
        >Upload data for {{ tableType }} (csv)</v-card-title
      >
      <v-card-text>
        <v-row>
          <v-col>
            <v-file-input
              v-model="file"
              variant="outlined"
              density="compact"
              show-size
              accept=".csv"
              placeholder="Click to choose a file"
              :label="tableType + ' File'"
              prepend-icon="mdi-paperclip"
            >
            </v-file-input>
          </v-col>
        </v-row>
        <v-row v-if="tableType === 'Yield Curve'">
          <v-col>
            <v-text-field
              v-model="yieldCurveCode"
              variant="outlined"
              density="compact"
              placeholder="Enter a yield curve code"
              label="Yield Curve Code"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="tableType === 'Yield Curve'">
          <v-col>
            <v-select
              v-model="selectedYear"
              variant="outlined"
              density="compact"
              label="Select a year for this data set"
              :items="availableYears"
              item-title="year"
              item-value="year"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-if="tableType === 'Yield Curve'">
            <v-select
              v-model="selectedMonth"
              variant="outlined"
              density="compact"
              label="Select a month for this yield curve table"
              :items="availableMonths"
              item-title="month"
              item-value="month"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              :loading="uploadInProgress"
              :disabled="uploadDisabled"
              rounded
              size="small"
              color="primary"
              class="primary mr-7"
              @click="uploadFile"
              >Upload</v-btn
            >
            <v-progress-circular
              class="mr-7"
              indeterminate
              :size="loaderSize"
              :width="2"
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded variant="text" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>Upload Status for {{ fileName }}</v-card-title>
      <v-card-text>
        <h4>Table was successfully uploaded</h4>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn rounded variant="text" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar" centered :timeout="timeout" :multi-line="true">
      {{ snackbarText }}
      <v-btn rounded color="red" variant="text" @click="closeDialog">Close</v-btn>
    </v-snackbar>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import ProductService from '../api/ProductService'
// import { createTemplate } from "../utils/helpers";
const newprops = defineProps(['tableType', 'assumptionType'])

// data
const uploadInProgress: any = ref(false)
const uploadDisabled: any = ref(false)
const snackbarText: any = ref(null)
const timeout: any = ref(3000)
const snackbar: any = ref(false)
// const date: any = ref(null);
// const menu: any = ref(false);
// const loading: any = ref(false);
const loaderSize: any = ref(0)
const uploadSuccess: any = ref(false)
// const error: any = ref(false);
// const errorMessages: any = ref([]);
const file: any = ref(null)
const dialog: any = ref(false)
const selectedYear: any = ref(null)
const selectedMonth: any = ref(null)
const yieldCurveCode: any = ref(null)
const selectedType: any = ref(null)
const fileName: any = ref(null)

// computed
const availableYears: any = computed(() => {
  const years: any = []
  const currentYear: any = new Date().getFullYear()

  for (let i = 0; i < 20; i++) {
    years.push(currentYear - i)
  }
  return years
})

const availableMonths: any = computed(() => {
  const months: any = []
  for (let i = 1; i < 13; i++) {
    months.push({ month: i })
  }
  return months
})

// methods
const closeDialog = () => {
  snackbar.value = false
  dialog.value = false
  uploadSuccess.value = false
  uploadInProgress.value = false
  selectedYear.value = null
  file.value = null
  yieldCurveCode.value = null
  selectedMonth.value = null
  uploadDisabled.value = false
}

const uploadFile = () => {
  if (selectedType.value !== null && file.value !== null) {
    const formdata: any = new FormData()
    formdata.append('file', file.value)
    formdata.append('assumption_type', newprops.tableType)
    formdata.append('year', selectedYear.value)
    formdata.append('month', selectedMonth.value)
    formdata.append('yield_curve_code', yieldCurveCode.value)
    uploadInProgress.value = true
    uploadDisabled.value = true
    ProductService.uploadBulkAssumptions({ formdata })
      .then((res: any) => {
        if (res.status === 200) {
          // closeDialog();
          snackbarText.value = 'The data has been successfully updated'
          timeout.value = 3000
          snackbar.value = true
          uploadInProgress.value = false
          uploadDisabled.value = false
        }
      })
      .catch(() => {})
  }
}

// const resetErrorState = () => {
//   error.value = false;
//   errorMessages.value = [];
// };

// const checkFileName = (value: any) => {
//   if (value !== null && value.name === fileName.value + ".csv") {
//     return true;
//   }
//   return "The file name without the .csv extension must match the chosen table name";
// };

// export default {
//   props: ["tableType", "assumptionType"],
//   data: () => ({
//     uploadInProgress: false,
//     uploadDisabled: false,
//     text: null,
//     timeout: 3000,
//     snackbar: false,
//     date: null,
//     menu: false,
//     loading: false,
//     loaderSize: 0,
//     uploadSuccess: false,
//     error: false,
//     errorMessages: [],
//     file: null,
//     dialog: false,
//     selectedYear: null,
//     selectedMonth: null,
//     yieldCurveCode: null,
//   }),
//   computed: {
//     availableYears() {
//       const years = [];
//       const currentYear = new Date().getFullYear();

//       for (let i = 0; i < 20; i++) {
//         years.push(currentYear - i);
//       }
//       return years;
//     },
//     availableMonths() {
//       const months = [];
//       for (let i = 1; i < 13; i++) {
//         months.push({ month: i });
//       }
//       return months;
//     },
//   },
//   methods: {
//     closeDialog() {
//       this.snackbar = false;
//       this.dialog = false;
//       this.uploadSuccess = false;
//       this.uploadInProgress = false;
//       this.selectedYear = null;
//       this.file = null;
//       this.yieldCurveCode = null;
//       this.selectedMonth = null;
//       this.uploadDisabled = false;
//     },

//     uploadFile() {
//       if (this.selectedType !== null && this.file !== null) {
//         const formdata = new FormData();
//         formdata.append("file", this.file);
//         formdata.append("assumption_type", this.tableType);
//         formdata.append("year", this.selectedYear);
//         formdata.append("month", this.selectedMonth);
//         formdata.append("yield_curve_code", this.yieldCurveCode);
//         this.uploadInProgress = true;
//         this.uploadDisabled = true;
//         ProductService.uploadBulkAssumptions({ formdata })
//           .then((res) => {
//             if (res.status === 200) {
//               // this.closeDialog();
//               this.text = "The data has been successfully updated";
//               this.timeout = 3000;
//               this.snackbar = true;
//               this.uploadInProgress = false;
//               this.uploadDisabled = false;
//             }
//           })
//           .catch(() => {
//           });
//       }
//     },

//     resetErrorState() {
//       this.error = false;
//       this.errorMessages = [];
//     },
//     checkFileName(value) {
//       if (value !== null && value.name === this.fileName + ".csv") {
//         return true;
//       }
//       return "The file name without the .csv extension must match the chosen table name";
//     },
//   },
// };
</script>
