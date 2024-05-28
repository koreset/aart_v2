<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="props.modelPointVars" :items-per-page="5"
          class="elevation-1"></v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

const props = defineProps({
  modelPointVars: {
    type: Array,
    required: true,
  },
})

console.log('Model Point Vars', props.modelPointVars)

const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Code', value: 'code' },
  { text: 'Data Type', value: 'type' },
]
</script>

<style></style>
