import Api from '@/renderer/api/Api'

export default {
  getLicVariables() {
    return Api.get('lic/base-variables')
  },
  getLicConfigs() {
    return Api.get('lic/run-configs')
  },
  getPortfolios() {
    return Api.get('ibnr/portfolios')
  },
  createPortfolio(portfolio) {
    return Api.post('ibnr/portfolios', portfolio)
  },
  deletePortfolio(portfolio) {
    return Api.delete('ibnr/portfolios/' + portfolio)
  },
  getLicTableMetaData() {
    return Api.get('ibnr/table-metadata')
  },
  uploadLicModelpoints(formdata) {
    return Api.post('ibnr/claims-data', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  executeManualRun(formdata) {
    return Api.post('ibnr/manual-ibnr-run', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadTables(formdata) {
    return Api.post('ibnr/tables', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getLicClaimsData(portfolioName, type, year, version) {
    return Api.get(
      'ibnr/claims-data/' +
        portfolioName +
        '/type/' +
        type +
        '/year/' +
        year +
        '/version/' +
        version
    )
  },
  getDataForTable(tableName) {
    return Api.get('ibnr/tables/' + tableName)
  },
  getValidPortfolios() {
    return Api.get('ibnr/valid-portfolios')
  },
  getClaimsYears(portfolioName) {
    return Api.get('ibnr/claims-years/' + portfolioName)
  },
  getParameterYears(portfolioName) {
    return Api.get('ibnr/parameter-years/' + portfolioName)
  },
  getYieldCurveYears() {
    return Api.get('ibnr/yield-curve-years')
  },
  getYieldCurveMonths(year) {
    return Api.get('ibnr/yield-curve-months/' + year)
  },
  runJobs(jobs) {
    return Api.post('ibnr/run-jobs', jobs)
  },
  getProjectionJobs() {
    return Api.get('ibnr/run-jobs')
  },
  deleteRun(runId) {
    return Api.delete('ibnr/run-jobs/' + runId)
  },
  getProjectionRunResults(runId, runType, product) {
    if (product !== null) {
      return Api.get(
        'ibnr/run-results/' + runId + '/result-type/' + runType + '/product/' + product
      )
    } else {
      return Api.get('ibnr/run-results/' + runId + '/result-type/' + runType)
    }
  },
  checkRunName(runName) {
    return Api.post('ibnr/check-run-name/' + runName)
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
    return Api.delete('ibnr/tables/' + tableName)
  },
  getAvailableParameterBases(portfolio, year) {
    return Api.get('ibnr/parameter-bases/' + portfolio + '/year/' + year)
  },
  getAvailableShockBases() {
    return Api.get('ibnr/shock-bases')
  },
  deleteTableData(tableName, portfolioName, year, version) {
    return Api.delete(
      'ibnr/table-data/' +
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
  }
}
