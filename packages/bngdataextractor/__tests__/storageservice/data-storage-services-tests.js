import { POSTGRES_URL } from './../../src/applicationconfig/config'
import Sequelize from 'sequelize'
import HabitatBaselineStorageService from '../../src/datastorage/storageservice/habitat-baseline-storage-service.js'
import HabitatEnhancementService from '../../src/datastorage/storageservice/habitat-enhancement-storage-service.js'
import StartStorageService from '../../src/datastorage/storageservice/start-storage-service.js'

describe('BNG habitat data storage', () => {
  let habitatBaselineStorageService
  let habitatEnhancementService
  let startStorageService

  beforeEach(async () => {
    const sequelize = new Sequelize(POSTGRES_URL)
    habitatBaselineStorageService = new HabitatBaselineStorageService(sequelize)
    habitatEnhancementService = new HabitatEnhancementService(sequelize)
    startStorageService = new StartStorageService(sequelize)
  })

  afterEach(async () => {
    habitatBaselineStorageService = undefined
    startStorageService = undefined
  })

  it('should extract and store habitat data from metric file', async () => {
    const startStorage = startStorageService.getStartStorage()
    const habitatBaseline = habitatBaselineStorageService.getHabitatBaseline()
    const habitatEnhancement = habitatEnhancementService.getHabitatEnhancement()
    startStorage.hasMany(habitatBaseline, { as: 'habitatBaseline', foreignKey: 'planningApplicationReference' })
    startStorage.hasMany(habitatEnhancement, { as: 'habitatEnhancement', foreignKey: 'planningApplicationReference' })
  })
})
