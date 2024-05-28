<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="tableClass"
            outlined
            dense
            :items="classifications"
            item-text="name"
            item-value="value"
            label="File Classification"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="table"
            outlined
            dense
            :items="allTables"
            label="Choose table"
          ></v-select>
        </v-col>
        <v-col cols="4">
          <v-file-input
            v-model="file"
            outlined
            dense
            show-size
            :error-messages="fileErrors"
            accept=".csv"
            placeholder="Add Associated file"
            prepend-icon="mdi-paperclip"
          >
          </v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center" cols="12">
          <v-btn rounded small color="accent" @click="addToFileList">Add to List</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="fileDescriptors.length > 0">
        <v-col>
          <v-simple-table class="trans-tables">
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">Table Class</th>
                  <th class="text-left">Table Name</th>
                  <th class="text-left">File</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in fileDescriptors" :key="item.table">
                  <td>{{ item.class }}</td>
                  <td>{{ item.table }}</td>
                  <td>{{ item.filename }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-alert v-if="filesErrors.length > 0" dense outlined type="error">
            {{ filesErrors[0] }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-if="fileDescriptors.length > 0">
        <v-col>
          <v-select
            key="user"
            v-model="selectedReviewer"
            label="Choose a reviewer in your organisation"
            outlined
            :items="orgUsers"
            item-text="user"
            item-value="user"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-center">
          <v-btn
            rounded
            small
            :loading="uploadInProgress"
            :disabled="uploadDisabled"
            color="accent"
            @click="uploadToServer"
            >Upload for review <v-icon right dark> mdi-cloud-upload </v-icon></v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-4"></v-divider>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">
// import ProductService from "../../api/ProductService";
// import Papa from "papaparse";
// import { useProductStore } from "../../store/product_config";
import { ref } from 'vue'

// const snakifyKeys = (fields)=> {
//   // because this function can receive map of ArrayNodes, we have to do this
//   const jsonFields = JSON.parse(JSON.stringify(fields));

//   for (const key in jsonFields) {
//     if (jsonFields[key] instanceof Object) {
//       // we need to go deeper!
//       jsonFields[key] = snakifyKeys(jsonFields[key]);
//     }

//     const snakeKey = key
//       .replace(/\.?([A-Z]+)/g, function (x, y) {
//         return "_" + y.toLowerCase();
//       })
//       .replace(/^_/, "");
//     jsonFields[snakeKey] = jsonFields[key];
//     // remove the unwanted camelCase key
//     if (snakeKey !== key) {
//       delete jsonFields[key];
//     }
//   }
//   return jsonFields;
// }

// // data
// const store = useProductStore();

const uploadDisabled: any = ref(false)
const uploadInProgress: any = ref(false)
const selectedReviewer: any = ref(null)
const file: any = ref(null)
const orgUsers: any = ref([])
// const files: any = ref([]);
const fileDescriptors: any = ref([])
const tableClass: any = ref('')
const table: any = ref('')
// const commonFilesAdded: any = ref(false);
const classifications: any = ref([
  // { name: 'Model Point', value: 'ModelPoint' },
  { name: 'Transition Rates', value: 'TransitionRates' }
  // { name: 'Distribution', value: 'Distribution' },
  // { name: 'BenefitStructure', value: 'BenefitStructure' },
])

const allTables: any = ref([])
const fileErrors: any = ref([])
const filesErrors: any = ref([])

// methods
const addToFileList = () => {
  console.log('addToFileList')
}

const uploadToServer = () => {
  console.log('uploadToServer')
}

// export default {
//   props: ["editMode"],
//   data: () => {
//     return {
//       uploadDisabled: false,
//       uploadInProgress: false,
//       selectedReviewer: null,
//       file: null,
//       orgUsers: [],
//       files: [],
//       fileDescriptors: [],
//       tableClass: "",
//       table: "",
//       commonFilesAdded: false,
//       classifications: [
//         // { name: 'Model Point', value: 'ModelPoint' },
//         { name: "Transition Rates", value: "TransitionRates" },
//         // { name: 'Distribution', value: 'Distribution' },
//         // { name: 'BenefitStructure', value: 'BenefitStructure' },
//       ],
//     };
//   },
//   created() {
//     ProductService.getOrgUsers({ name: this.organization }).then((res) => {
//       this.orgUsers = res.data;
//     });
//   },
//   validations: {
//     file: {
//       checkFileName: function (value) {
//         if (!this.tableClass) {
//           return true; // We can't be validating against an empty table name
//         }
//         if (
//           value !== null &&
//           value !== undefined &&
//           value.name.toLowerCase() === this.table.toLowerCase() + ".csv"
//         ) {
//           return true;
//         } else {
//           return false;
//         }
//       },
//       checkColumns: async function (value) {
//         if (value) {
//           const data = await this.processCSVFile(value);
//           const rt = this.ratingFactors.filter(
//             (item) => item.table === this.table
//           );
//           const fds = rt[0].fds;
//           const headerRow = data[0];
//           let valid = false;
//           if (fds.length === headerRow.length - 1) {
//             valid = true;
//           } else {
//             valid = false;
//           }
//           return valid;
//         } else {
//           return true;
//         }
//       },
//       checkRowSize: async function (value) {
//         if (value) {
//           const data = await this.processCSVFile(value);
//           const rt = this.ratingFactors.filter(
//             (item) => item.table === this.table
//           );
//           const fds = rt[0].fds;
//           let dim = 1;
//           let valid = false;

//           fds.forEach((item) => (dim = dim * item.dimension));
//           if (dim == data.length - 1) {
//             valid = true;
//           } else {
//             valid = false;
//           }
//           return valid;
//         }
//       },
//     },
//     files: {
//       // eslint-disable-next-line no-unused-vars
//       allFilesLoaded: function (value) {
//         return true;
//       },
//     },
//   },
//   methods: {
//     tryContinue() {
//       this.$emit("formContinue", 6);
//     },
//     uploadToServer() {
//       // Verify that all parts of the product config is complete
//       this.$v.files.$touch();
//       if (!this.$v.files.$invalid) {
//         this.$v.$reset();
//         // Add product tables
//         this.fileDescriptors.forEach((item) => {
//           const pt = { table: item.table, tableClass: item.class };
//           this.$store.commit("addToProductTable", pt);
//         });
//         const formData = new FormData();
//         // Add files to be uploaded
//         for (let i = 0; i < this.files.length; i++) {
//           const file = this.files[i];
//           formData.append("files[]", file);
//         }

//         formData.append(
//           "product",
//           JSON.stringify(snakifyKeys(this.$store.state.product))
//         );
//         formData.append(
//           "product_features",
//           JSON.stringify(snakifyKeys(this.$store.state.selectedFeatures))
//         );
//         formData.append("editMode", this.editMode);
//         formData.append("user", store.get("license.metadata.user"));
//         formData.append("reviewer", this.selectedReviewer);
//         this.uploadInProgress = true;
//         ProductService.postConfiguredProduct(formData)
//           .then((res) => {
//             this.uploadDisabled = false;
//             this.$emit("productComplete", res.data);
//             this.uploadInProgress = false;
//           })
//           .catch((err) => {
//             this.uploadInProgress = false;
//             this.$emit("productError", err);
//           });
//       }
//     },
//     configReset() {
//       this.uploadDisabled = false;
//       this.$emit("formReset", 1);
//     },
//     addToFileList() {
//       if (!this.$v.file.$invalid) {
//         this.$v.file.$reset();
//         const fd = {
//           table: this.table,
//           class: this.tableClass,
//           filename: this.file.name,
//         };
//         if (!this.fileDescriptors.some((f) => f.table === this.table)) {
//           this.fileDescriptors.unshift(fd);
//           this.files.unshift(this.file);
//         }

//         // Add common tables here...
//         if (!this.commonFilesAdded) {
//           const yieldCurve = {
//             table: "Yield_Curve",
//             class: "Global",
//             filename: "file must be uploaded prior to valuation run",
//           };
//           const parameters = {
//             table: "Parameters",
//             class: "Parameters",
//             filename: "file must be uploaded prior to valuation run",
//           };
//           const margins = {
//             table: "Margins",
//             class: "Margins",
//             filename: "file must be uploaded prior to valuation run",
//           };
//           const lapseMargin = {
//             table: "Lapse_Margins",
//             class: "LapseMargins",
//             filename: "file must be uploaded prior to valuation run",
//           };
//           const clawback = {
//             table: "Clawback",
//             class: "Distribution",
//             filename: "file must be uploaded prior to valuation run",
//           };
//           const shocks = {
//             table: "Shocks",
//             class: "Valuations",
//             filename: "file must be uploaded prior to valuation run",
//           };
//           const profitMargins = {
//             table: "Profit_Margins",
//             class: "Profitabilities",
//             filename: "file must be uploaded prior to pricing run",
//           };
//           const newBusinessProfile = {
//             table: "New_Business_Profiles",
//             class: "Profitabilities",
//             filename: "file must be uploaded prior to pricing run",
//           };

//           this.fileDescriptors.push(
//             yieldCurve,
//             parameters,
//             margins,
//             lapseMargin,
//             clawback,
//             shocks,
//             profitMargins,
//             newBusinessProfile
//           );
//           this.commonFilesAdded = true;
//         }

//         //
//         if (
//           this.selectedFeatures.some((item) => item.name === "FUNERAL_COVER")
//         ) {
//           // Add the required tables to the list

//           if (
//             !this.fileDescriptors.some((f) => f.table === "Child_Sum_Assured")
//           ) {
//             const childSA = {
//               table: "Child_Sum_Assured",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(childSA);
//           }

//           if (
//             this.selectedFeatures.some((item) => item.name === "RIDER_BENEFIT")
//           ) {
//             if (
//               !this.fileDescriptors.some(
//                 (item) => item.table === "Funeral_Service"
//               )
//             ) {
//               if (
//                 !this.fileDescriptors.some(
//                   (f) => f.table === "Child_Additional_Sum_Assured"
//                 )
//               ) {
//                 const childAdditionalSumAssured = {
//                   table: "Child_Additional_Sum_Assured",
//                   class: "BenefitStructure",
//                   filename: "file must be uploaded prior to valuation run",
//                 };
//                 this.fileDescriptors.push(childAdditionalSumAssured);
//               }
//               if (!this.fileDescriptors.some((f) => f.table === "Riders")) {
//                 const riders = {
//                   table: "Riders",
//                   class: "BenefitStructure",
//                   filename: "file must be uploaded prior to valuation run",
//                 };

//                 this.fileDescriptors.push(riders);
//               }
//             }
//           }

//           if (
//             this.selectedFeatures.some(
//               (item) => item.name === "ACCIDENTAL_DEATH_BENEFIT"
//             )
//           ) {
//             if (
//               !this.fileDescriptors.some(
//                 (item) => item.table === "Accident_Benefit_Multiplier"
//               )
//             ) {
//               const accidentBenefitMultiplier = {
//                 table: "Accident_Benefit_Multiplier",
//                 class: "BenefitStructure",
//                 filename: "file must be uploaded prior to valuation run",
//               };
//               this.fileDescriptors.push(accidentBenefitMultiplier);
//             }
//           }
//         }

//         if (
//           this.selectedFeatures.some(
//             (item) => item.name === "PROPORTIONAL_REINSURANCE"
//           )
//         ) {
//           if (!this.fileDescriptors.some((f) => f.table === "Reinsurance")) {
//             const reinsurance = {
//               table: "Reinsurance",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(reinsurance);
//           }
//         }

//         if (
//           this.selectedFeatures.some(
//             (item) => item.name === "BENEFIT_MULTIPLIER"
//           )
//         ) {
//           if (
//             !this.fileDescriptors.some((f) => f.table === "Benefit_Multiplier")
//           ) {
//             const benefit_multiplier = {
//               table: "Benefit_Multiplier",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(benefit_multiplier);
//           }
//         }

//         if (this.selectedFeatures.some((item) => item.name === "NON_LIFE")) {
//           if (!this.fileDescriptors.some((f) => f.table === "NonLifeRatings")) {
//             const nonlifeRatings = {
//               table: "NonLifeRatings",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(nonlifeRatings);
//           }
//         }

//         if (
//           this.selectedFeatures.some(
//             (item) => item.name === "SPECIAL_DECREMENT_MARGIN"
//           )
//         ) {
//           if (
//             !this.fileDescriptors.some(
//               (f) => f.table === "Special_Decrement_Margins"
//             )
//           ) {
//             const specialDecrementMargin = {
//               table: "Special_Decrement_Margins",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(specialDecrementMargin);
//           }
//         }

//         if (
//           this.selectedFeatures.some(
//             (item) => item.name === "RENEWABLE_PROFIT_ADJUSTMENT"
//           )
//         ) {
//           if (
//             !this.fileDescriptors.some(
//               (f) => f.table === "Renewable_Profit_Adjustments"
//             )
//           ) {
//             const renewableProfitAdjustment = {
//               table: "Renewable_Profit_Adjustments",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(renewableProfitAdjustment);
//           }
//         }

//         if (this.selectedFeatures.some((item) => item.name === "UNIT_FUND")) {
//           if (
//             !this.fileDescriptors.some((f) => f.table === "Unit_Fund_Charges")
//           ) {
//             const unitFunds = {
//               table: "Unit_Fund_Charges",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(unitFunds);
//           }
//           if (
//             !this.fileDescriptors.some((f) => f.table === "Investment_Returns")
//           ) {
//             const investment_returns = {
//               table: "Investment_Returns",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(investment_returns);
//           }

//           if (
//             !this.fileDescriptors.some(
//               (f) => f.table === "Fund_Asset_Distributions"
//             )
//           ) {
//             const fad = {
//               table: "Fund_Asset_Distributions",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(fad);
//           }
//         }

//         if (this.selectedFeatures.some((item) => item.name === "WITH_PROFIT")) {
//           if (
//             !this.fileDescriptors.some((f) => f.table === "Investment_Returns")
//           ) {
//             const investment_returns = {
//               table: "Investment_Returns",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(investment_returns);
//           }

//           if (
//             !this.fileDescriptors.some((f) => f.table === "Unit_Fund_Charges")
//           ) {
//             const unitFunds = {
//               table: "Unit_Fund_Charges",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(unitFunds);
//           }

//           if (
//             !this.fileDescriptors.some(
//               (f) => f.table === "Fund_Asset_Distributions"
//             )
//           ) {
//             const fad = {
//               table: "Fund_Asset_Distributions",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(fad);
//           }
//         }

//         if (this.selectedFeatures.some((item) => item.name === "MATURITY_BENEFIT_PATTERN")) {
//           if (
//             !this.fileDescriptors.some((f) => f.table === "Maturity_Patterns")
//           ) {
//             const maturity_patterns = {
//               table: "Maturity_Patterns",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(maturity_patterns);
//           }
//         }

//         if (this.selectedFeatures.some((item) => item.name === "SURRENDER_VALUE_QUADRATIC_FORMULA")) {
//           if (
//             !this.fileDescriptors.some((f) => f.table === "Surrender_Value_Coefficients")
//           ) {
//             const maturity_patterns = {
//               table: "Surrender_Value_Coefficients",
//               class: "BenefitStructure",
//               filename: "file must be uploaded prior to valuation run",
//             };
//             this.fileDescriptors.push(maturity_patterns);
//           }
//         }

//       }
//       this.table = "";
//       this.tableClass = "";
//       this.file = null;
//     },
//     processCSVFile(csv) {
//       const config = {
//         preview: 1,
//         skipEmptyLines: true,
//       };
//       return new Promise((resolve, reject) => {
//         if (csv) {
//           Papa.parse(csv, {
//             config,
//             error: reject,
//             complete: (results) => {
//               const filtered = results.data.filter((item) => {
//                 return item.length > 1;
//               });
//               resolve(filtered);
//             },
//           });
//         }
//       });
//     },
//   },
//   computed: {
//     selectedFeatures() {
//       return this.$store.state.selectedFeatures;
//     },
//     organization() {
//       return this.$store.state.licenseData.organization;
//     },
//     fileErrors() {
//       const errors = [];
//       if (!this.$v.file.$dirty) return errors;
//       !this.$v.file.checkFileName &&
//         errors.push(
//           "The file name without the .csv extension must match the chosen table name"
//         );
//       !this.$v.file.checkColumns &&
//         errors.push(
//           "The column order found in the file does not match the specified rating factor order"
//         );
//       !this.$v.file.checkRowSize &&
//         errors.push(
//           "The number of rows do not match with specified dimensions"
//         );
//       return errors;
//     },
//     filesErrors() {
//       const errors = [];
//       if (!this.$v.files.$dirty) return errors;
//       !this.$v.files.allFilesLoaded.$invalid &&
//         errors.push(
//           "All named tables must have associated files attached and uploaded"
//         );
//       return errors;
//     },
//     ratingFactors() {
//       return this.$store.state.product.productRatingFactors;
//     },
//     allTables() {
//       let tables = [];
//       this.$store.state.product.productTransitions.forEach((element) => {
//         tables = [...tables, element.associatedTable];
//       });
//       this.$store.state.product.globalTables.forEach((element) => {
//         tables = [...tables, element.name];
//       });
//       return tables;
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
