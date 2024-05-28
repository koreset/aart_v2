import Api from '@/renderer/api/Api'

export default {
  getLicVariables() {
    return Api.get('lic/base-variables')
  },
  getLicConfigs() {
    return Api.get('lic/run-configs')
  },
  createPortfolio(portfolio) {
    return Api.post('lic/portfolios', portfolio)
  },
  deletePortfolio(portfolio) {
    return Api.delete('lic/portfolios/' + portfolio)
  },
  getLicTableMetaData() {
    return Api.get('lic/table-metadata')
  },
  uploadLicModelpoints(formdata) {
    return Api.post('lic/claims-data', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  executeManualRun(formdata) {
    return Api.post('lic/manual-ibnr-run', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadTables(formdata) {
    return Api.post('lic/tables', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getLicClaimsData(portfolioName, type, year, version) {
    return Api.get(
      'lic/claims-data/' + portfolioName + '/type/' + type + '/year/' + year + '/version/' + version
    )
  },
  getDataForTable(tableName) {
    return Api.get('lic/tables/' + tableName)
  },
  getValidPortfolios() {
    return Api.get('lic/valid-portfolios')
  },
  getClaimsYears(portfolioName) {
    return Api.get('lic/claims-years/' + portfolioName)
  },
  getParameterYears(portfolioName) {
    return Api.get('lic/parameter-years/' + portfolioName)
  },
  getYieldCurveYears() {
    return Api.get('lic/yield-curve-years')
  },
  getYieldCurveMonths(year) {
    return Api.get('lic/yield-curve-months/' + year)
  },
  runJobs(jobs) {
    return Api.post('lic/run-jobs', jobs)
  },
  getProjectionJobs() {
    return Api.get('lic/run-jobs')
  },
  deleteRun(runId) {
    return Api.delete('lic/run-jobs/' + runId)
  },
  getProjectionRunResults(runId, runType, product) {
    if (product !== null) {
      return Api.get('lic/run-results/' + runId + '/result-type/' + runType + '/product/' + product)
    } else {
      return Api.get('lic/run-results/' + runId + '/result-type/' + runType)
    }
  },
  checkRunName(runName) {
    return Api.post('lic/check-run-name/' + runName)
  },
  checkLicRunName(runName) {
    return Api.post('lic/check-lic-run-name/' + runName)
  },

  checkConfigName(configName) {
    return Api.post('lic/check-config-name/' + configName)
  },
  getProductsForPortfolio(portfolioId) {
    return Api.get('lic/products/' + portfolioId)
  },
  getRunConfigs() {
    return Api.get('lic/run-configs')
  },
  saveRunConfig(runConfig) {
    return Api.post('lic/lic-config', runConfig)
  },
  executeLicRun(runConfigs) {
    return Api.post('lic/run-lic-jobs', runConfigs)
  },
  getShockSettings() {
    return Api.get('/ibnr/shock-settings')
  },
  deleteShockSetting(settingId) {
    return Api.delete('/ibnr/shock-settings/' + settingId)
  },
  saveShockSetting(setting) {
    return Api.post('/ibnr/shock-settings', setting)
  },
  getModelPointRows() {
    return Api.get('/lic/model-point-rows')
  },
  getLicBuildUps(runDate, portfolioName, productName) {
    if (runDate !== null && portfolioName !== null && productName !== null) {
      return Api.get(
        '/lic/build-ups/' + runDate + '/portfolio/' + portfolioName + '/product/' + productName
      )
    } else if (runDate !== null && portfolioName !== null && productName === null) {
      return Api.get('/lic/build-ups/' + runDate + '/portfolio/' + portfolioName)
    } else if (runDate !== null && portfolioName === null && productName === null) {
      return Api.get('/lic/build-ups/' + runDate)
    } else if (runDate === null && portfolioName === null && productName === null) {
      return Api.get('/lic/build-ups')
    }
  },
  getLicRuns() {
    return Api.get('/lic/lic-runs')
  },

  // test endpoint for streaming table data
  getWinners(request) {
    return Api.post('/lic/winners', request)
  },
  checkExistingLicRun(csmRun) {
    return Api.post('lic/check-lic-run', csmRun)
  },
  deleteTable(tableName) {
    return Api.delete('lic/tables/' + tableName)
  },
  getAvailableParameterBases(portfolio, year) {
    return Api.get('lic/parameter-bases/' + portfolio + '/year/' + year)
  },
  getAvailableShockBases() {
    return Api.get('lic/shock-bases')
  },
  deleteTableData(tableName, portfolioName, year, version) {
    return Api.delete(
      'lic/table-data/' +
        tableName +
        '/portfolio/' +
        portfolioName +
        '/year/' +
        year +
        '/version/' +
        version
    )
  },
  deleteLicRun(runId) {
    return Api.delete('lic/lic-runs/' + runId)
  },
  deleteConfiguration(configId) {
    return Api.delete('lic/lic-configs/' + configId)
  },
  getAvailableInputVersions(portfolioName, year) {
    return Api.get('lic/available-input-versions/' + portfolioName + '/year/' + year)
  },
  getAvailableParameterYears() {
    return Api.get('lic/available-parameter-years')
  },
  getAvailableParameterVersions(year) {
    return Api.get('lic/available-parameter-versions/' + year)
  }
}
