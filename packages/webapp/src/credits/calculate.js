import unitPrices from './unit-prices.js'

export default tierInputAmounts => {
  const tierCosts = Object.entries(tierInputAmounts).map(([k, v]) => {
    const unitAmount = Number(v) || 0

    return {
      tier: k,
      unitAmount,
      cost: unitAmount * unitPrices[k]
    }
  })

  return {
    tierCosts,
    total: tierCosts.reduce((acc, cur) => acc + cur.cost, 0)
  }
}
