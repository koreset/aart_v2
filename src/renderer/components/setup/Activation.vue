<template>
  <div>
    <v-card style="height: 70vh">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="8" class="d-flex flex-column">
              <v-text-field
                v-model:model-value="license"
                variant="outlined"
                density="compact"
                label="Enter license"
                placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"
                :maxlength="39"
                :error-messages="keyErrors"
                @update:modelValue="addDashes"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-btn color="primary" rounded size="small" @click="activateLicense"
                >Activate license</v-btn
              >
            </v-col>
          </v-row>
          <v-row v-if="activationSuccess">
            <v-col cols="8">
              <v-text-field
                v-model="baseApi"
                label="API Url"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="primary" rounded size="small" @click="saveApiUrl">Apply Setting</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="apiUrlComplete">
            <v-col>
              <v-btn color="primary" rounded size="small" @click="completeSetup"
                >Complete Setup</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const baseApi = ref('')

const saveApiUrl = () => {
  apiUrlComplete.value = false
  console.log('Saving API URL: ', baseApi.value)
  window.mainApi?.send('msgSaveBaseUrl', baseApi.value)
  apiUrlComplete.value = true
}

const completeSetup = () => {
  window.mainApi?.send('msgRestartApplication')
}

const licenseUrl = import.meta.env.VITE_APP_LICENSE_SERVER

const getFingerprint = () => {
  return window.mainApi?.sendSync('msgGetMachineFingerprint')
}

const fingerPrint = getFingerprint()

console.log('Fingerprint:', fingerPrint)
console.log('License URL: ', licenseUrl)
// console.log('Finger Print: ', fingerPrint)

// data
const keyErrors: any = ref([])
// const keyInfo: any = ref('Provide the licence key that was issued to you via email or from your company administrator.')
const validLicense = ref(false)
const license: any = ref(null)
const licenseMsg: any = ref('')
const activationSuccess = ref(false)
const apiUrlComplete = ref(false)

// methods
const addDashes = () => {
  license.value = license.value.toUpperCase()
  if (license.value.length === 4 || license.value.length === 9) {
    license.value += '-'
  }

  if (license.value.length === 14 || license.value.length === 19) {
    license.value += '-'
  }

  if (license.value.length === 24 || license.value.length === 29) {
    license.value += '-'
  }

  if (license.value.length === 34) {
    license.value += '-'
  }
}

const activateLicense = async () => {
  activationSuccess.value = false
  apiUrlComplete.value = false
  keyErrors.value = []
  const validation = await fetch(licenseUrl + '/activate-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      key: license.value,
      fingerprint: fingerPrint
    })
  })

  const rs = await validation.json()
  console.log('Validation result: ', rs)
  console.log('Validation meta result: ', rs.meta.constant)
  // We are doing machine activations to avoid catch 22, right?
  keyErrors.value = []
  switch (rs.meta.constant) {
    case 'NO_MACHINE':
    case 'VALID':
      validLicense.value = true
      window.mainApi?.send('msgSetUserLicense', rs.license_data)
      licenseMsg.value = 'License activated successfully'
      activationSuccess.value = true
      break
    case 'SUSPENDED':
      keyErrors.value.push('This license has been suspended. Please provide a valid license')
      break
    case 'EXPIRED':
      keyErrors.value.push('This license has expired. Please provide a valid license')
      break
    case 'NOT_FOUND':
      keyErrors.value.push(
        'This license does not exist. Please contact your admin for a valid license'
      )
      break
    case 'FINGERPRINT_SCOPE_MISMATCH':
      keyErrors.value.push(
        'This license cannot be registered on this machine. Please provide a valid license'
      )
      break
    default:
      keyErrors.value.push(
        'This license cannot be registered successfully. Please provide a valid license'
      )
  }
}
</script>

<style scoped></style>
