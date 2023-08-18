import calculateCost from '../calculate.js'

const calculationInput = {
  a1: '1.5', a2: '1.5', a3: '1.5', a4: '1.5', a5: '1.5', h: '1.5', w: '1.5'
}

const calculationResult = {
  tierCosts: [
    { tier: 'a1', unitAmount: 1.5, cost: 63000 },
    { tier: 'a2', unitAmount: 1.5, cost: 72000 },
    { tier: 'a3', unitAmount: 1.5, cost: 99000 },
    { tier: 'a4', unitAmount: 1.5, cost: 187500 },
    { tier: 'a5', unitAmount: 1.5, cost: 975000 },
    { tier: 'h', unitAmount: 1.5, cost: 66000 },
    { tier: 'w', unitAmount: 1.5, cost: 345000 }
  ],
  total: 1807500
}

const calculationInputEmpty = {
  a1: '', a2: '', a3: '', a4: '', a5: '', h: '', w: ''
}

const calculationResultEmpty = {
  tierCosts: [
    { tier: 'a1', unitAmount: 0, cost: 0 },
    { tier: 'a2', unitAmount: 0, cost: 0 },
    { tier: 'a3', unitAmount: 0, cost: 0 },
    { tier: 'a4', unitAmount: 0, cost: 0 },
    { tier: 'a5', unitAmount: 0, cost: 0 },
    { tier: 'h', unitAmount: 0, cost: 0 },
    { tier: 'w', unitAmount: 0, cost: 0 }
  ],
  total: 0
}

describe('credits calculate', () => {
  it('Calculation result should match expected for each tier', () => {
    expect(calculateCost(calculationInput)).toMatchObject(calculationResult)
  })

  it('Calculation result should handle empty input', () => {
    expect(calculateCost(calculationInputEmpty)).toMatchObject(calculationResultEmpty)
  })
})
