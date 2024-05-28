<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
  <v-navigation-drawer v-model="internalDrawer" class="custom-navbar" dark color="navbar" location="left">
    <v-container>
      <v-row>
        <v-col>
          <v-img class="ml-3" src="../assets/aart-logo-02.png"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <v-list>
      <v-list-item class="list-item-text" :to="{ name: 'dashboard' }" :title="'Dashboard'"
        :prepend-icon="'mdi-monitor-dashboard'"></v-list-item>
      <v-list-item :to="{ name: 'product-setup' }" :prepend-icon="'mdi-table-settings'">
        <v-list-item-title>Product Configuration</v-list-item-title>
      </v-list-item>
      <v-list-group value="Products Menu">
        <template #activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Products"></v-list-item>
        </template>
        <v-list-group v-for="item in products" :key="item">
          <template #activator="{ props }">
            <v-list-item v-if="item.products.length > 0" v-bind="props" :title="item.name"></v-list-item>
          </template>
          <v-list-item v-for="product in item.products" :key="product.id"
            :to="{ name: 'product-detail', params: { id: product.id } }" :title="product.product_name">
          </v-list-item>

        </v-list-group>

      </v-list-group>

      <v-list-item :to="{ name: 'global-tables' }" :prepend-icon="'mdi-table'">
        <v-list-item-title>Global Tables</v-list-item-title>
      </v-list-item>
      <v-list-item :to="{ name: 'product-comparison' }" :prepend-icon="'mdi-table'">
        <v-list-item-title>Product Comparison</v-list-item-title>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { watchEffect, defineProps, ref, onMounted } from 'vue'
import ProductService from '@/renderer/api/ProductService'
const props = defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
})

const products: any = ref([])

const internalDrawer = ref(props.drawer)

watchEffect(() => {
  internalDrawer.value = props.drawer
})

onMounted(() => {
  ProductService.getProducts().then((response: any) => {
    products.value = response.data
  })
})
</script>

<style scoped>
.custom-navbar {
  font-size: 11px !important;
}

.list-item-text {
  font-size: 8px !important;
}
</style>
