import Api from '@/api/Api'

export default {
  getAllProducts() {
    return Api.get('csm-engine/all-products')
  },

  getSpCodes(productCode) {
    return Api.get('csm-engine/spcodes/' + productCode)
  },

  getIfrs17Groups(productCode) {
    return Api.get('csm-engine/ifrs17groups/' + productCode)
  },

  postRAConfigurationList(configs) {
    const json = JSON.stringify(configs)
    return Api.post('csm-engine/ra-config', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  getRAConfigurations() {
    return Api.get('csm-engine/ra-config')
  },

  getAosVariables() {
    return Api.get('csm-engine/aos-vars')
  },
  postRiskDrivers(drivers) {
    const json = JSON.stringify(drivers)
    return Api.post('csm-engine/risk-drivers', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  getRiskDrivers() {
    return Api.get('csm-engine/risk-drivers')
  },
  deleteRiskDrivers(product) {
    return Api.delete('csm-engine/risk-drivers/' + product)
  },

  postAosConfigurations(configSet) {
    const json = JSON.stringify(configSet)
    return Api.post('csm-engine/aos-config', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  getAosConfigurations() {
    return Api.get('csm-engine/aos-config')
  },

  getFinancialReports(runDate, productCode) {
    return Api.get('csm-engine/reports/financials/run/' + runDate + '/product/' + productCode)
  },
  uploadRAFactors(payload) {
    return Api.post('ra-factors', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getRAFactors() {
    return Api.get('ra-factors')
  },
  getIfrs17TableMetaData() {
    return Api.get('csm-engine/ifrs17-table-metadata')
  },
  runCsmProcess(payload) {
    const json = JSON.stringify(payload)
    return Api.post('csm-engine/run-csm', json)
  },

  uploadFinanceFile(payload) {
    return Api.post('csm-engine/upload-finance-file', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadTransitionAdjustments(payload) {
    return Api.post('csm-engine/upload-transition-adjustments', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  uploadPAAFinance(payload) {
    return Api.post('csm-engine/upload-paa-finance', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  getExistingConfigs() {
    return Api.get('csm-engine/get-existing-configs')
  },
  getFinanceFile() {
    return Api.get('csm-engine/get-finance-file')
  },
  getProductSteps(prodCode, runId) {
    return Api.get('csm-engine/products-report-list/' + prodCode + '/run/' + runId)
  },
  getPAAProductSteps(prodCode, runId) {
    return Api.get('csm-engine/paa-products-report-list/' + prodCode + '/run/' + runId)
  },
  getPAAGroupSteps(prodCode, runId, group) {
    return Api.get(
      'csm-engine/paa-products-report-list/' + prodCode + '/run/' + runId + '/group/' + group
    )
  },

  getGroupSteps(group) {
    return Api.get('csm-engine/groups-report-list/' + group)
  },
  getGroupStepsWithRunDate(runDate, group) {
    console.log(runDate, group)
    return Api.get('csm-engine/groups-report-list/run-date/' + runDate + '/group/' + group)
  },
  getCsmProductList(runDate) {
    return Api.get('csm-engine/csm-product-list/' + runDate)
  },
  getAosProductList(runDate) {
    return Api.get('csm-engine/aos-products/run/' + runDate)
  },
  getAosSingleRunProductList(runId, runDate) {
    return Api.get('csm-engine/csm-run/' + runId + '/run-date/' + runDate)
  },
  getPaaSingleRunProductList(runId, runDate) {
    return Api.get('csm-engine/csm-paa-run/' + runId + '/run-date/' + runDate)
  },

  getPaaSingleRunProduct(runId, prodCode, runDate) {
    return Api.get(
      'csm-engine/csm-paa-run/' + runId + '/run-date/' + runDate + '/product/' + prodCode
    )
  },

  getPaaSingleRunProductGroup(runId, prodCode, group, runDate) {
    return Api.get(
      'csm-engine/csm-paa-run/' +
        runId +
        '/run-date/' +
        runDate +
        '/product/' +
        prodCode +
        '/group/' +
        group
    )
  },

  getAosSingleRunProduct(runId, runDate, prodCode) {
    return Api.get('csm-engine/csm-run/' + runId + '/run-date/' + runDate + '/product/' + prodCode)
  },
  getAosSingleRunProductGroup(runId, runDate, prodCode, group) {
    return Api.get(
      'csm-engine/csm-run/' +
        runId +
        '/run-date/' +
        runDate +
        '/product/' +
        prodCode +
        '/group/' +
        group
    )
  },

  getPAAProductList(runDate) {
    return Api.get('csm-engine/paa-products/run/' + runDate)
  },

  getCsmRunList() {
    return Api.get('csm-engine/csm-run-list')
  },
  getAosRunList() {
    return Api.get('csm-engine/aos-run-list')
  },

  getPAARunList(eligibilityMode) {
    return Api.get('csm-engine/paa-run-list/' + eligibilityMode)
  },

  getPAARuns() {
    return Api.get('paa/paa-runlist')
  },
  getAvailableFinanceAndRaYears(measure, paaRun) {
    if (paaRun === undefined || paaRun === null) {
      return Api.get('csm-engine/available-finance-and-ra-years/' + measure)
    } else {
      return Api.get('csm-engine/available-finance-and-ra-years/' + measure + '/' + paaRun)
    }
  },
  getRunPortfolios(runDate) {
    return Api.get('gmm-engine/run/' + runDate + '/portfolios')
  },
  getRunPortfolioProducts(runDate, portfolio) {
    return Api.get('gmm-engine/run/' + runDate + '/portfolios/' + portfolio + '/products')
  },
  getPortfolioProductGroups(runDate, portfolio, product) {
    return Api.get(
      'gmm-engine/run/' + runDate + '/portfolios/' + portfolio + '/products/' + product + '/groups'
    )
  },
  getPortfolioProductGroup(runDate, portfolio, product, group) {
    return Api.get(
      'gmm-engine/run/' +
        runDate +
        '/portfolios/' +
        portfolio +
        '/products/' +
        product +
        '/groups/' +
        group
    )
  },
  checkExistingRun(csmRun) {
    return Api.post('csm-engine/run-csm/check-existing-run', csmRun)
  },

  getCsmReportGroupsByRunDate(runDate, product) {
    return Api.get('csm-engine/je-report-groups/' + runDate + '/product/' + product)
  },
  getJournalEntriesByGroup(group, run) {
    return Api.get('csm-engine/journal-reports/' + run + '/group/' + group)
  },
  getJournalEntriesByProduct(run, prodCode) {
    return Api.get('csm-engine/journal-entries/products/' + run + '/' + prodCode)
  },
  getJournalEntryProducts(runDate) {
    return Api.get('csm-engine/journal-entries/products/' + runDate)
  },
  getBalanceSheetProducts(runDate) {
    return Api.get('csm-engine/balance-sheet-reports/' + runDate)
  },
  getBalanceSheetRecordByProduct(runDate, prodCode) {
    return Api.get('csm-engine/balance-sheet-reports/' + runDate + '/product/' + prodCode)
  },
  getBalanceSheetRecordByProductGroup(runDate, prodCode, group) {
    return Api.get(
      'csm-engine/balance-sheet-reports/' + runDate + '/product/' + prodCode + '/group/' + group
    )
  },
  getSubLedgerByProduct(runDate, prodCode) {
    return Api.get('csm-engine/subledger-reports/' + runDate + '/product/' + prodCode)
  },

  getSubLedgerByGroup(group, runDate) {
    return Api.get('csm-engine/subledger-reports/' + runDate + '/group/' + group)
  },
  getSubLedgerByRunDate(runDate) {
    return Api.get('csm-engine/subledger-reports/' + runDate)
  },

  getTrialBalanceByRunDate(runDate) {
    return Api.get('csm-engine/trialbalance-reports/' + runDate)
  },

  getTrialBalanceByGroup(group, runDate) {
    return Api.get('csm-engine/trialbalance-reports/' + runDate + '/group/' + group)
  },

  getTrialBalanceByProduct(prodCode, runDate) {
    return Api.get('csm-engine/trialbalance-reports/' + runDate + '/product/' + prodCode)
  },
  getReportByGroup(group) {
    return Api.get('csm-engine/aos-results-group-excel/' + group, {
      responseType: 'blob'
    })
  },

  getReportByProduct(product) {
    return Api.get('csm-engine/aos-results-prodcode-excel/' + product, {
      responseType: 'blob'
    })
  },
  getLiabilityMovementRunList() {
    return Api.get('csm-engine/lm-movement-runlist')
  },

  getLiabilityMovementReport(runDate, productCode, ifrs17Group) {
    if (runDate !== null && productCode === null && ifrs17Group === null) {
      return Api.get('csm-engine/lm-movement/run/' + runDate)
    }

    if (runDate !== null && productCode !== null && ifrs17Group === null) {
      return Api.get('csm-engine/lm-products/run/' + runDate + '/product/' + productCode)
    }

    if (runDate !== null && productCode !== null && ifrs17Group !== null) {
      return Api.get(
        'csm-engine/lm-products/run/' +
          runDate +
          '/product/' +
          productCode +
          '/group/' +
          ifrs17Group
      )
    }
  },

  getInsuranceRevenueReport(productCode, ifrs17Group) {
    if (ifrs17Group === null || typeof ifrs17Group === 'undefined') {
      return Api.get('csm-engine/ir-report/' + productCode)
    } else {
      return Api.get('csm-engine/ir-report/' + productCode + '/' + ifrs17Group)
    }
  },

  getInitialRecognitionReport(productCode, ifrs17Group) {
    if (ifrs17Group === null || typeof ifrs17Group === 'undefined') {
      return Api.get('csm-engine/nb-report/' + productCode)
    } else {
      return Api.get('csm-engine/nb-report/' + productCode + '/' + ifrs17Group)
    }
  },

  getCsmProjectionRuns() {
    return Api.get('csm-engine/csm-projections/run-list')
  },
  getCsmProjectionProducts(run) {
    return Api.get('csm-engine/csm-projections/run/' + run)
  },
  getCsmProjectionProductGroups(run, productCode) {
    return Api.get('csm-engine/csm-projections/run/' + run + '/product/' + productCode)
  },

  getCsmProjectionProductGroup(run, productCode, ifrs17Group) {
    return Api.get(
      'csm-engine/csm-projections/run/' + run + '/product/' + productCode + '/group/' + ifrs17Group
    )
  },

  getLiabilityMovementProducts(runDate) {
    return Api.get('csm-engine/lm-products/run/' + runDate)
  },
  getLiabilityMovementProductGroups(productCode) {
    return Api.get('csm-engine/lm-products/' + productCode)
  },
  getInsuranceRevenueRuns() {
    return Api.get('csm-engine/ir-report/runlist')
  },
  getInsuranceRevenueForRun(runDate) {
    return Api.get('csm-engine/ir-report/run/' + runDate)
  },
  getInsuranceRevenueForProduct(runDate, productCode) {
    return Api.get('csm-engine/ir-report/run/' + runDate + '/product/' + productCode)
  },
  getInsuranceRevenueForProductGroup(runDate, productCode, ifrs17Group) {
    return Api.get(
      'csm-engine/ir-report/run/' + runDate + '/product/' + productCode + '/group/' + ifrs17Group
    )
  },
  getInitialRecogRuns() {
    return Api.get('csm-engine/nb-report/runlist')
  },
  getInitialRecogProducts(runDate) {
    return Api.get('csm-engine/nb-report/run/' + runDate)
  },
  getInitialRecogForProduct(runDate, productCode) {
    return Api.get('csm-engine/nb-report/run/' + runDate + '/product/' + productCode)
  },
  getInitialRecogForProductGroup(runDate, productCode, ifrs17Group) {
    return Api.get(
      'csm-engine/nb-report/run/' + runDate + '/product/' + productCode + '/group/' + ifrs17Group
    )
  },
  getCsmRuns() {
    return Api.get('csm-engine/csm-runs')
  },
  deleteIfrs17Job(jobId, type, runDate) {
    return Api.delete(
      'csm-engine/csm-runs/measurement-type/' + type + '/run/' + jobId + '/run-date/' + runDate
    )
  },
  deleteAosConfig(jobId) {
    return Api.delete('csm-engine/aos-config/' + jobId)
  },
  getDataForTable(table) {
    return Api.get('csm-engine/get-table-data/' + table)
  },
  checkRunName(run) {
    return Api.post('csm-engine/run-csm/check-existing-run-name/' + run)
  },
  deleteTable(table) {
    return Api.delete('csm-engine/delete-table/' + table)
  },
  uploadSAPFile(payload) {
    return Api.post('csm-engine/upload-sap-file', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getSapFileList() {
    return Api.get('csm-engine/get-sap-file-list')
  },
  getSapResultsForRun(runName) {
    return Api.get('csm-engine/get-sap-result-info/' + runName)
  },
  deleteSapData(runName) {
    return Api.delete('csm-engine/delete-sap-data/' + runName)
  },

  getBelProductList(runDate) {
    console.log('runDate', runDate)
    return Api.get('csm-engine/bel-buildups/run/' + runDate)
  },
  getBelForProduct(runDate, productCode) {
    return Api.get('csm-engine/bel-buildups/run/' + runDate + '/product/' + productCode)
  },
  getBelForProductGroup(runDate, productCode, ifrs17Group) {
    return Api.get(
      'csm-engine/bel-buildups/run/' + runDate + '/product/' + productCode + '/group/' + ifrs17Group
    )
  },
  getAvailableFinanceVersions(financeYear) {
    return Api.get('csm-engine/available-paa-finance-versions/year/' + financeYear)
  },
  getAvailableGMMFinanceVersions(financeYear) {
    return Api.get('csm-engine/available-gmm-finance-versions/year/' + financeYear)
  }
}
