import instance from './Api'

const Api = instance
const licenseServerUrl = import.meta.env.VITE_LICENSE_SERVER_URL

export default {
  deleteProduct(id) {
    return Api.delete('products/' + id)
  },
  activateProduct(payload) {
    return Api.post('products/' + payload.productId + '/activate', payload)
  },
  getProducts() {
    return Api.get('products')
  },
  getRatingFactors() {
    return Api.get('rating-factors')
  },
  uploadProductTable(payload) {
    return Api.post('products/' + payload.productId + '/update-table', payload.formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getFeatures() {
    return Api.get('prodconfig/features')
  },
  getSelectedFeatures(selectedFeatures) {
    const json = JSON.stringify(selectedFeatures)
    return Api.post('prodconfig/select-features', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  getProductById(id) {
    return Api.get('products/' + id)
  },
  getProductModelPointStats(id, runId) {
    return Api.get('products/' + id + '/run/' + runId + '/modelpointstats')
  },
  getProductFamilies() {
    return Api.get('productfamilies')
  },
  getTransitionStates() {
    return Api.get('markovstates')
  },
  getModelPoints() {
    return Api.get('modelpointvariables')
  },
  getAvailableParameters() {
    return Api.get('prodconfig/assumptions/variables')
  },
  postConfiguredProduct(formdata) {
    return Api.post('products', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  postProductModelPoints(formdata, id, handleProgress) {
    return Api.post('products/' + id + '/modelpoints', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      },
      onUploadProgress: handleProgress
    })
  },
  postProductPricingModelPoints(formdata, id) {
    return Api.post('products/' + id + '/pricing-modelpoints', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  deleteProductPricingModelPoints(id) {
    return Api.delete('products/' + id + '/pricing-modelpoints')
  },
  deleteProductPricingParameters(id) {
    return Api.delete('products/' + id + '/pricing-parameters')
  },
  getModelPointCountForProduct(id) {
    return Api.get('products/' + id + '/modelpoint-counts')
  },
  getArraysIntersection(a1, a2) {
    return a1.filter(function (n) {
      return a2.indexOf(n) !== -1
    })
  },
  getModelPointsForProduct(id, year) {
    return Api.get('products/' + id + '/modelpoints/' + year)
  },

  deleteModelPointsForProduct(id, year) {
    return Api.delete('products/' + id + '/modelpoints/' + year)
  },

  runProjections(payload) {
    return Api.post('projections', payload)
  },
  getValuationJobs() {
    return Api.get('valuations/jobs')
  },
  getProductsForValuationJob(selectedJob) {
    return Api.get('valuations/jobs/' + selectedJob.id + '/products')
  },
  getPricingJobs() {
    return Api.get('pricing/jobs')
  },

  getValuationJob(id) {
    return Api.get('valuations/jobs/' + id)
  },
  getValuationJobControl(id) {
    return Api.get('valuations/jobs/' + id + '/control')
  },

  getPricingJob(id) {
    return Api.get('pricing/jobs/' + id)
  },

  getProductTable(payload) {
    return Api.post('product-tables', payload)
  },

  getProductPricingTable(payload) {
    return Api.post('product-pricing-tables', payload)
  },

  checkProductCode(value) {
    return Api.get('products/' + value + '/check-product-code')
  },
  checkProductName(value) {
    return Api.get('products/' + value + '/check-product-name')
  },

  getAnnualResults() {
    console.log('getting annual results')
    return Api.get('reports/annual-consolidated')
  },
  getMonthlyResults() {
    console.log('getting monthly results')
    return Api.get('reports/monthly-consolidated')
  },
  getDisclosures(id) {
    return Api.get('reports/disclosures/' + id)
  },
  getOrgUsers(organization) {
    const json = JSON.stringify(organization)
    return Api.post('get-org-users', json, {
      baseURL: licenseServerUrl + '/',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
  },
  getModelPointStructure(productCode) {
    return Api.get('modelpointvariables/' + productCode + '/structure')
  },

  getAssociatedTableStructure(tableId) {
    return Api.get('product-tables/' + tableId + '/get-table')
  },
  uploadBulkAssumptions(payload) {
    return Api.post('bulk-tables', payload.formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  deleteProductTable(productId, tableId) {
    return Api.delete('products/' + productId + '/product-tables/' + tableId)
  },
  getGlobalTableData(tableName) {
    return Api.get('global-tables/' + tableName)
  },
  deleteGlobalTableData(tableName) {
    return Api.delete('global-tables/' + tableName)
  },
  deleteProductModelPoints(productId, year) {
    return Api.delete('products/' + productId + '/modelpoints/' + year)
  },
  getYieldCurveCodes(year) {
    return Api.get('tables/yield-curve-codes/' + year)
  },
  getYieldCurveMonths(year, code) {
    return Api.get('tables/yield-curve-months/' + year + '/' + code)
  },
  deleteYieldCurveData(year, code, month) {
    return Api.delete('tables/yield-curve/' + year + '/' + code + '/' + month)
  },
  deletePricingProductTable(productId, tableId) {
    return Api.delete('products/' + productId + '/product-pricing-tables/' + tableId)
  },
  getModelPointSummary(productId, year, version) {
    return Api.get('products/' + productId + '/modelpointstats/' + year + '/version/' + version)
  },
  getModelPointVersions(productId, year) {
    return Api.get('products/' + productId + '/modelpointversions/' + year)
  }
}
