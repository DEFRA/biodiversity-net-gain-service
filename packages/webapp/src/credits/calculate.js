import unitPrices from './unit-prices.js'

export default creditTiers => {
  const tierCosts = creditTiers.map(item => ({
    ...item,
    cost: item.unitAmount * unitPrices[item.tier]
  }))

  return {
    tierCosts,
    total: tierCosts.reduce((acc, cur) => acc + cur.cost, 0)
  }
}
