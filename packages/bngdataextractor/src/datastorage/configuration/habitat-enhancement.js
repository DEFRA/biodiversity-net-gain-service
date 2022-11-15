import DataTypes from 'sequelize'

export const habitatEnhancementConfig = {
  planningApplicationReference: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  baselineHabitat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  totalHabitatArea: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineDistinctivenessBand: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineDistinctivenessScore: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineConditionCategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineConditionScore: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineStrategicSignificanceCategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineStrategicSignificanceScore: {
    type: DataTypes.STRING,
    allowNull: true
  },
  baselineHabitatUnits: {
    type: DataTypes.STRING,
    allowNull: true
  },
  suggestedActionToAddressHabitatLosses: {
    type: DataTypes.STRING,
    allowNull: true
  },
  conditionalDataValidation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proposedBroadHabitat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proposedHabitatPrePopulatedButCanBeOverridden: {
    type: DataTypes.STRING,
    allowNull: true
  },
  distinctivenessChange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  conditionChange: {
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
  strategicPositionMultiplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  standardTimeToTargetConditionYears: {
    type: DataTypes.STRING,
    allowNull: true
  },
  standardOrAdjustedTimeToTargetCondition: {
    type: DataTypes.STRING,
    allowNull: false
  },
  finalTimeToTargetConditionYears: {
    type: DataTypes.STRING,
    allowNull: true
  },
  finalTimeToTargetMultiplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  difficultyOfEnhancementCategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  appliedDifficulltyMultiplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: true
  },
  difficultyMultiplierApplied: {
    type: DataTypes.STRING,
    allowNull: true
  },
  spatialRiskCategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  spatialRiskMultiplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proposedHabitat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  areaHectares: {
    type: DataTypes.STRING,
    allowNull: true
  },
  habitatUnitsDelivered: {
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
  }
}
