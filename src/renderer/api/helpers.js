const ObjectsToCsv = require('objects-to-csv')

export async function createTemplate(cols, filename) {
  const tObj = {}
  cols.forEach((col) => {
    tObj[col] = ''
  })
  const csv = new ObjectsToCsv([tObj])
  let result = await csv.toString()
  if (!result.match(/^data:text\/csv/i)) {
    result = 'data:text/csv;charset=utf-8,' + result
  }

  const data = encodeURI(result)

  const fileLink = document.createElement('a')

  fileLink.href = data
  fileLink.setAttribute('download', filename)
  document.body.appendChild(fileLink)
  fileLink.click()
}
