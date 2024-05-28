import Api from '@/renderer/api/Api'

export default {
  runPricing(payload) {
    return Api.post('pricing/run', payload)
  },
  getPricing(runId) {
    return Api.get('pricing/jobs/' + runId)
  },
  deletePricing(runId) {
    return Api.delete('pricing/jobs/' + runId)
  },
  getScenarioData(scenarioId, runId) {
    return Api.get('pricing/jobs/' + runId + '/scenario/' + scenarioId)
  },
  deleteScenario(runId, scenarioId) {
    return Api.delete('pricing/jobs/' + runId + '/scenario/' + scenarioId)
  },
  checkRunName(runName) {
    return Api.get('pricing/check-run-name/' + runName)
  },
  getPricingParams(productCode) {
    return Api.get('/pricing/get-pricing-params/' + productCode)
  },

  getProductPricingParams(productCode) {
    return Api.get('/pricing/get-params/' + productCode)
  },
  getPricingDemographics(productCode) {
    return Api.get('/pricing/get-pricing-demographics/' + productCode)
  },
  getModelPointCount(productCode) {
    return Api.get('/pricing/get-modelpoints/' + productCode)
  },
  getPricingExcelResults(jobId) {
    return Api.get('pricing/jobs/' + jobId + '/excel', { responseType: 'blob' })
  },
  getPricingExcelControlResults(jobId, scenarioId, productCode) {
    return Api.get(
      'pricing/jobs/' + jobId + '/scenario/' + scenarioId + '/product/' + productCode + '/excel',
      { responseType: 'blob' }
    )
  },
  getPricingParameters() {
    return Api.get('pricing/get-pricing-params')
  },
  deletePricingParameters(productCode) {
    return Api.delete('pricing/delete-pricing-params/' + productCode)
  },

  deletePricingDemographics(productCode) {
    return Api.delete('pricing/delete-pricing-demographics/' + productCode)
  },
  deletePricingTableData() {
    return Api.delete('pricing/delete-pricing-params')
  },
  deleteModelPointsData(productCode) {
    return Api.delete('pricing/delete-pricing-points/' + productCode)
  },

  uploadPricingParameters(payload) {
    return Api.post('pricing/upload-params', payload.formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadPricingDemographics(payload) {
    return Api.post('pricing/upload-demographics', payload.formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  uploadBulkPricingParameters(payload) {
    return Api.post('pricing/upload-bulk-params', payload.formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadProductPricingTable(payload) {
    return Api.post('products/' + payload.productId + '/update-pricing-table', payload.formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  deleteModelPoints(productCode, mpVersion) {
    return Api.delete('pricing/delete-model-points/' + productCode + '/' + mpVersion)
  }
}
