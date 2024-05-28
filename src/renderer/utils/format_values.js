function isFloat(value) {
  if (typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value)) {
    return true
  }

  return false
}

function isInteger(value) {
  if (typeof value === 'number' && !Number.isNaN(value) && Number.isInteger(value)) {
    return true
  }
  return false
}

export const formatValues = (params) => {
  const header = params.column.userProvidedColDef.headerName

  if (isFloat(params.value)) {
    if (Math.abs(params.value) / 100 > 1) {
      return params.value.toLocaleString()
    } else {
      return params.value.toFixed(3)
    }
  }

  if (isInteger(params.value)) {
    if (header !== 'year' && header !== 'id' && header !== 'policy_number') {
      return params.value.toLocaleString()
    } else {
      return params.value
    }
  }

  return params.value
}

export default formatValues
