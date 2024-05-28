import Api from '@/renderer/api/Api'
export default {
  getReserves(payload) {
    return Api.post('projections/jobs/reserves', payload)
  },
  checkRunName(runName) {
    return Api.get('valuations/check-run-name/' + runName)
  },
  getJobsForProduct(prodCode) {
    return Api.get('valuations/products/jobs/' + prodCode)
  },
  deleteProjectionJob(jobId) {
    return Api.delete('valuations/jobs/' + jobId)
  },
  getExcelResults(jobId, control) {
    if (control) {
      return Api.get('valuations/jobs/' + jobId + '/excel/control', { responseType: 'blob' })
    } else {
      return Api.get('valuations/jobs/' + jobId + '/excel', { responseType: 'blob' })
    }
  },

  getAvailableYieldYears() {
    return Api.get('tables/yield-curve')
  },
  getAvailableParameterYears(prodCode) {
    return Api.get('tables/parameters/' + prodCode)
  },
  getAvailableModelPointYears(prodCode) {
    return Api.get('tables/model-points/' + prodCode)
  },
  getAvailableLapseYears(prodCode) {
    return Api.get('tables/lapse/' + prodCode)
  },
  getAvailableLapseMarginYears(prodCode) {
    return Api.get('tables/lapse-margin/' + prodCode)
  },
  getAvailableMortalityYears(prodCode) {
    return Api.get('tables/mortality/' + prodCode)
  },
  getAvailableRetrenchmentYears(prodCode) {
    return Api.get('tables/retrenchment/' + prodCode)
  },
  getAvailableDisabilityYears(prodCode) {
    return Api.get('tables/disability/' + prodCode)
  },
  saveShockSetting(shockSetting) {
    return Api.post('projections/shock-settings', shockSetting)
  },
  deleteShockSetting(shockSetting) {
    return Api.delete('projections/shock-settings/' + shockSetting)
  },

  getShockSettings(shockSetting) {
    return Api.get('projections/shock-settings', shockSetting)
  },
  saveJobTemplate(template) {
    return Api.post('projections/jobs/templates', template)
  },
  getJobTemplates() {
    return Api.get('projections/jobs/templates')
  },
  getJobTemplate(id) {
    return Api.get('projections/jobs/templates/' + id)
  },
  deleteJobTemplate(id) {
    return Api.delete('projections/jobs/templates/' + id)
  },
  getAvailableBases(productCode, year) {
    // return Api.get("projections/shock-bases" )
    return Api.get('product-tables/' + productCode + '/year/' + year + '/get-basis')
  },
  getAvailableShockBases() {
    return Api.get('projections/shock-bases')
    // return Api.get("product-tables/" + productCode + "/get-basis")
  },
  getModelPointVersionsForProduct(productId, year) {
    return Api.get('product-tables/' + productId + '/year/' + year + '/get-versions')
  }
}
