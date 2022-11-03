import {POSTGRES_URL} from './../../src/applicationconfig/config';
import Sequelize from 'sequelize';
import HabitatBaselineStorageService from '../../src/datastorage/storageservice/habitat-baseline-storage-service.js'
import HabitatEnhancementService from '../../src/datastorage/storageservice/habitat-enhancement-storage-service.js'
import StartStorageService from '../../src/datastorage/storageservice/start-storage-service.js'
import BngExtractionService from '../../src/bng-metric-extraction-service'
import fs from 'fs';
import path from 'path';

describe ('BNG habitat data storage', () => {
	
	let readableStream = undefined;
	let habitatBaselineStorageService = undefined;
	let habitatEnhancementService = undefined;
	let startStorageService = undefined;
	let bngExtractionService = undefined;
	
	beforeEach( async () => {
		const sequelize = new Sequelize(POSTGRES_URL);
		habitatBaselineStorageService = new HabitatBaselineStorageService(sequelize);
		habitatEnhancementService = new HabitatEnhancementService(sequelize);
		startStorageService = new StartStorageService(sequelize);
		
		readableStream = fs.createReadStream(path.join(path.resolve(), '__tests__/metricfiles/biodiversity30.xlsm'));
		bngExtractionService = new BngExtractionService();
	});
	
	afterEach(async () => {
		habitatBaselineStorageService = undefined;
		startStorageService = undefined;
		readableStream = undefined;
		bngExtractionService = undefined;
	})
	
	it('should extract and store habitat data from metric file', async () => {
		
		const habitatBaselineExtractedDate = await bngExtractionService.extractMetricContent(readableStream);
		let startStorage = startStorageService.getStartStorage();
		let habitatBaseline = habitatBaselineStorageService.getHabitatBaseline();
		let habitatEnhancement = habitatEnhancementService.getHabitatEnhancement();
		startStorage.hasMany(habitatBaseline, {as : 'habitatBaseline', foreignKey : 'planningApplicationReference'});
		startStorage.hasMany(habitatEnhancement, {as : 'habitatEnhancement', foreignKey : 'planningApplicationReference'});
		
		const storedStartData = await startStorageService.storeExtractedData(habitatBaselineExtractedDate);
		const storedhabitatData = await habitatBaselineStorageService.storeExtractedData(habitatBaselineExtractedDate);
		const storedHabitatEnhancementData = await habitatEnhancementService.storeExtractedData(habitatBaselineExtractedDate);
	});
	
});
