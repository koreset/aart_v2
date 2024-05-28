import Api from '@/renderer/api/Api'

export default {
  runJobs(jobs) {
    return Api.post('/gmm-engine/run-projections', jobs)
  },

  getShockSettings() {
    return Api.get('/gmm-engine/shock-settings')
  },
  getShockBases() {
    return Api.get('/gmm-engine/shock-bases')
  },
  deleteShockSetting(id) {
    return Api.delete('/gmm-engine/shock-settings/' + id)
  },
  saveShockSetting(setting) {
    return Api.post('/gmm-engine/shock-settings', setting)
  },
  postProductModelPoints(formdata, id) {
    return Api.post('gmm-engine/' + id + '/modelpoints', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadModelPoints(formdata) {
    return Api.post('gmm-engine/modelpoints', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  uploadParameters(formdata) {
    return Api.post('gmm-engine/parameters', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadTables(formdata) {
    return Api.post('gmm-engine/tables', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadGmmModelpointTables(formdata) {
    return Api.post('gmm-engine/portfolios/modelpoints', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getTableMetaData() {
    return Api.get('/gmm-engine/tables')
  },
  getProjectionJobs() {
    return Api.get('/gmm-engine/run-jobs')
  },

  getProjections(runId) {
    return Api.get('/gmm-engine/projections/' + runId)
  },
  getProjectionsForGroup(runId, group) {
    return Api.get('/gmm-engine/projections/' + runId + '/group/' + group)
  },

  getDataForTable(tableType) {
    return Api.get('/gmm-engine/tables/' + tableType.toLowerCase())
  },
  deleteRun(itemId) {
    return Api.delete('/gmm-engine/projections/' + itemId)
  },
  getPaaPortfolios() {
    return Api.get('gmm-engine/portfolios')
  },
  createPaaPortfolio(portfolio) {
    return Api.post('gmm-engine/portfolios', portfolio)
  },
  getPortfolioModelPoints(portfolioId, year, version) {
    return Api.get(
      'gmm-engine/portfolios/' + portfolioId + '/modelpoints/' + year + '/version/' + version
    )
  },
  getModelPointVersions(portfolioId, year) {
    return Api.get('gmm-engine/portfolios/' + portfolioId + '/modelpointyear/' + year)
  },

  deletePortfolio(portfolioId) {
    return Api.delete('gmm-engine/portfolios/' + portfolioId)
  },
  getValidPortfolios() {
    return Api.get('gmm-engine/valid-portfolios')
  },
  getModelPointYears(portfolioId) {
    return Api.get('gmm-engine/portfolios/' + portfolioId + '/modelpointyears')
  },
  getAvailablePortfolios() {
    return Api.get('gmm-engine/portfolios')
  },
  getAvailableParameterYears(portfolioName) {
    return Api.get('gmm-engine/available-parameter-years/' + portfolioName)
  },
  getAvailablePremiumPatternYears(portfolioName) {
    return Api.get('gmm-engine/available-premium-pattern-years/' + portfolioName)
  },
  checkRunName(runName) {
    return Api.get('gmm-engine/run-name-check/' + runName)
  },
  deleteTable(tableType) {
    return Api.delete('gmm-engine/tables/' + tableType)
  },
  checkPaaFinanceYear(portfolio, financeYear) {
    return Api.get('gmm-engine/portfolios/' + portfolio + '/financeyear/' + financeYear)
  },
  getAvailableMpVersions(portfolioName, year) {
    return Api.get('gmm-engine/available-mp-versions/' + portfolioName + '/year/' + year)
  },
  deleteModelPoints(portfolioId, mpYear, mpVersion) {
    if (mpVersion == null || mpVersion == '') {
      mpVersion = 'null'
    }
    return Api.delete(
      'gmm-engine/portfolios/' + portfolioId + '/modelpoints/' + mpYear + '/version/' + mpVersion
    )
  },
  getModelPointStats(portfolioName, year, version) {
    return Api.get(
      'gmm-engine/portfolio/' +
        portfolioName +
        '/year/' +
        year +
        '/version/' +
        version +
        '/modelpointstats'
    )
  },
  checkPortfolioName(portfolioName) {
    return Api.get('gmm-engine/portfolio-name-check/' + portfolioName)
  }
}
