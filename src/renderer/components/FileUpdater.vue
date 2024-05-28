<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template #activator="{ on }">
      <v-btn color="primary" dark icon v-on="on">
        <v-icon color="accent">mdi-file-upload</v-icon>
      </v-btn>
    </template>
    <v-card v-if="!uploadSuccess" class="rounded-lg">
      <v-card-title class="header-title accent white--text mb-4">Upload data (csv) for {{ fileName }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-file-input v-model="file" variant="outlined" density="compact" show-size accept=".csv"
              placeholder="Click to choose a file" :label="props.tableType + ' File'" prepend-icon="mdi-paperclip">
            </v-file-input>
          </v-col>
        </v-row>
        <v-row v-if="fileName === 'Yield_Curve'">
          <v-col>
            <v-text-field v-model="yieldCurveCode" outlined dense placeholder="Enter a yield curve code"
              label="Yield Curve Code"></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="showYearField()">
          <v-col>
            <v-select v-model="selectedYear" dense outlined label="Select a year for this data set"
              :items="availableYears" item-text="year" item-value="year"></v-select>
          </v-col>
          <v-col v-if="fileName === 'Yield_Curve'">
            <v-select v-model="selectedMonth" dense outlined label="Select a month for this yield curve table"
              :items="availableMonths" item-text="month" item-value="month"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn rounded small class="primary mr-7" @click="uploadFile">Upload</v-btn>
            <v-progress-circular class="mr-7" indeterminate :size="loaderSize" :width="2"
              color="primary"></v-progress-circular>
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
  </v-dialog>
</template>
<script setup lang="ts">
import ProductService from "../api/ProductService";
import { computed, ref } from "vue";
// import { createTemplate } from "../services/helpers";

// data
const loading: any = ref(false);
const loaderSize: any = ref(0);
const uploadSuccess: any = ref(false);
const error: any = ref(false);
const errorMessages: any = ref([]);
const file: any = ref(null);
const dialog: any = ref(false);
const selectedYear: any = ref(null);
const selectedMonth: any = ref(null);
const yieldCurveCode: any = ref(null);


const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  tableId: {
    type: Number,
    required: true,
  },
  tableClass: {
    type: String,
    required: true,
  },
});

// computed
const availableYears: any = computed(() => {
  const years: any = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 20; i++) {
    years.push(currentYear - i);
  }
  return years;
});

const availableMonths: any = computed(() => {
  const months: any = [];
  for (let i = 1; i < 13; i++) {
    months.push({ month: i });
  }
  return months;
});

// methods
const showYearField = () => {
  let result = true
  console.log('Type', props.type, props.tableClass);
  if (props.type === 'pricing' || props.tableClass === 'BenefitStructure') {
    result = false;
  } else {
    result = true;
  }

  return result;

}

const closeDialog = () => {
  dialog.value = false;
  uploadSuccess.value = false;
  selectedYear.value = null;
  file.value = null;
  resetErrorState();
  loaderSize.value = 0;

}

// const downloadTemplate = () => {
//   ProductService.getAssociatedTableStructure(tableId).then((res: any) => {
//     const columns = res.data;
//     createTemplate(columns, fileName);
//   });
// }

const uploadFile = () => {
  const formdata: any = new FormData();
  formdata.append("file", file.value);
  formdata.append("year", selectedYear.value);
  formdata.append("table_id", props.tableId);
  formdata.append("product_id", props.productId);
  formdata.append("product_code", props.productCode);
  formdata.append("yield_curve_code", yieldCurveCode.value);
  formdata.append("month", selectedMonth.value);
  loaderSize.value = 20;
  ProductService.uploadProductTable({
    formdata
  })
    .then(() => {
      uploadSuccess.value = true;
      resetErrorState();
      $emit("successUpload", props.tableId);
      yieldCurveCode.value = null;
      loaderSize.value = 0;
    })
    .catch((err: any) => {
      errorMessages.value.push(err.data.error);
      uploadSuccess.value = false;
      selectedYear.value = null;
      loaderSize.value = 0;
    });
}

const resetErrorState = () => {
  error.value = false;
  errorMessages.value = [];
}

const checkFileName = (value: any) => {
  if (value !== null && value.name === fileName.value + ".csv") {
    return true;
  }
  return "The file name without the .csv extension must match the chosen table name";
}

// export default {
//   props: ["type", "fileName", "productId", "productCode", "tableId", "tableClass"],
//   data: () => ({
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
//     showYearField() {
//       let result = true
//       console.log(this.type, this.tableClass);
//       if (this.type == 'pricing' || this.tableClass == 'BenefitStructure') {
//         result = false;
//       } else {
//         result = true;
//       }

//       return result;

//     },
//     closeDialog() {
//       this.dialog = false;
//       this.uploadSuccess = false;
//       this.selectedYear = null;
//       this.file = null;
//       this.resetErrorState();
//       this.loaderSize = 0;

//     },
//     downloadTemplate() {
//       ProductService.getAssociatedTableStructure(this.tableId).then((res) => {
//         const columns = res.data;
//         createTemplate(columns, this.fileName);
//       });
//     },
//     uploadFile() {
//       const formdata = new FormData();
//       formdata.append("file", this.file);
//       formdata.append("year", this.selectedYear);
//       formdata.append("table_id", this.tableId);
//       formdata.append("product_id", this.productId);
//       formdata.append("product_code", this.productCode);
//       formdata.append("yield_curve_code", this.yieldCurveCode);
//       formdata.append("month", this.selectedMonth);
//       this.loaderSize = 20;
//       ProductService.uploadProductTable({
//         formdata,
//         productId: this.productId,
//       })
//         .then(() => {
//           this.uploadSuccess = true;
//           this.resetErrorState();
//           this.$emit("successUpload", this.tableId);
//           this.yieldCurveCode = null;
//           this.loaderSize = 0;
//         })
//         .catch((err) => {
//           this.errorMessages.push(err.data.error);
//           this.uploadSuccess = false;
//           this.selectedYear = null;
//           this.loaderSize = 0;
//         });
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
