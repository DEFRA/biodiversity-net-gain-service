import unitPrices from './unit-prices.js'

export default tierInputAmounts => {
  const tierCosts = Object.entries(tierInputAmounts).map(([k, v]) => {
    const unitAmount = Number(v) || 0

    return {
      unitAmount,
      tier: k,
      cost: unitAmount * unitPrices[k]
    }
  })

  const total = tierCosts.reduce((acc, cur) => acc + cur.cost, 0)

  return { tierCosts, total }
}
