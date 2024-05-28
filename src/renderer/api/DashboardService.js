import Api from './Api'

export default {
  getReserveRuns() {
    return Api.get('reports/reserve-summary-runlist')
  },
  getPAAReserveRuns() {
    return Api.get('reports/paa-reserve-summary-runlist')
  },
  getReserveSummaries(runDate) {
    return Api.get('reports/reserve-summary/' + runDate)
  },
  getPAAReserveSummaries(runDate) {
    return Api.get('reports/paa-reserve-summary/' + runDate)
  },
  getPAAReserveSummariesForPortfolio(runDate, portfolio) {
    return Api.get('reports/paa-reserve-summary/' + runDate + '/portfolio/' + portfolio)
  },
  getPAAReserveSummariesForPortfolioProduct(runDate, portfolio, product) {
    return Api.get(
      'reports/paa-reserve-summary/' + runDate + '/portfolio/' + portfolio + '/product/' + product
    )
  },
  getPAAReserveSummariesForPortfolioProductGroup(runDate, portfolio, product, group) {
    return Api.get(
      'reports/paa-reserve-summary/' +
        runDate +
        '/portfolio/' +
        portfolio +
        '/product/' +
        product +
        '/group/' +
        group
    )
  },
  getReserveSummariesForProduct(runDate, product) {
    return Api.get('reports/reserve-summary/' + runDate + '/product/' + product)
  },
  getReserveSummariesForProductBasisAndSpCode(runDate, product, basis, spCode) {
    return Api.get(
      'reports/reserve-summary/' +
        runDate +
        '/product/' +
        product +
        '/basis/' +
        basis +
        '/spcode/' +
        spCode
    )
  },
  getReserveSummariesForProductAndBasis(runDate, product, basis) {
    return Api.get('reports/reserve-summary/' + runDate + '/product/' + product + '/basis/' + basis)
  }
}
