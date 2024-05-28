<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-table>
          <tbody>
            <tr v-for="item in associatedTables" :key="item.table">
              <td style="width: 70%">{{ item.table }}</td>
              <td style="text-align: center">
                <v-btn depressed rounded size="small" @click.stop="viewTable(item)">
                  <v-icon left color="primary">mdi-information</v-icon>
                  <span>Info</span>
                </v-btn>
              </td>
              <td style="text-align: center">
                <!-- <bulk-file-updater :tableType="item.name"></bulk-file-updater> -->
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
    <!-- <v-row v-if="globalTableData.length > 0 && !loadingData">
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
              </v-row> -->
  </v-container>
</template>

<script setup lang="ts">
// import ProductService from "../api/ProductService";
import { ref, defineProps } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const associatedTables: any = ref({})
associatedTables.value = props.product.product.product_tables
console.log("Associated Tables", associatedTables.value)

const confirmDelete = (item: any) => {
  console.log("Delete", item)
}

const viewTable = (item: any) => {
  console.log("View", item)
}

</script>

<style scoped></style>
