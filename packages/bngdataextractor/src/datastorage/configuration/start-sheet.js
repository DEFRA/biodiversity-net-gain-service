import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const DataTypes = require('sequelize')

export const startConfig = {
  planningApplicationReference: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  planningAuthority: {
    type: DataTypes.STRING,
    allowNull: true
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  applicant: {
    type: DataTypes.STRING,
    allowNull: true
  },
  applicationType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accessor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reviewer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metricVersion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  assessmentDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  planningAuthorityReviewer: {
    type: DataTypes.STRING,
    allowNull: true
  }
}
