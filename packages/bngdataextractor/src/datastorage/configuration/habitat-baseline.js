import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const DataTypes = require('sequelize')

export const habitatBaselineConfig = {
  planningApplicationReference: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  broadHabitat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  habitatType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  areaHectares: {
    type: DataTypes.STRING,
    allowNull: true
  },
  distinctiveness: {
    type: DataTypes.STRING,
    allowNull: true
  },
  score: {
    type: DataTypes.STRING,
    allowNull: true
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  score_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  strategicSignificance: {
    type: DataTypes.STRING,
    allowNull: true
  },
  strategicSignificance_1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  strategicSignificanceMultiplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  totalHabitatUnits: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineUnitsRetained: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineUnitsEnhanced: {
    type: DataTypes.STRING,
    allowNull: true
  },
  areaLost: {
    type: DataTypes.STRING,
    allowNull: true
  },
  unitsLost: {
    type: DataTypes.STRING,
    allowNull: true
  }
}
