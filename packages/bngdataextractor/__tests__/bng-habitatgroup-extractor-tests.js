import fs from'fs';
import path from 'path';
import BNGMatricHabitatGroupExtracrtor from '../src/extractors/bng-habitatgroup-extractor';
import {habitatGroupExtractionConfig} from '../src/extractors/extractionconfig/configuration.js';
import xslx from 'xlsx';


describe('BNG data extractor test', () => {
	let readableStream = undefined;
	let bNGMatricDataExtractor = undefined;
	
	beforeEach(() => {
		
		readableStream = fs.createReadStream(path.join(path.resolve(), '__tests__/metricfiles/biodiversity30.xlsm'));
		bNGMatricDataExtractor = new BNGMatricHabitatGroupExtracrtor();
		
	});
	
	afterEach(() => {
		
		readableStream = undefined;
		bNGMatricDataExtractor = undefined;
		
	});
	
	it('should transform excel stream to json G-2 Habitat groups', async () => {
		
		// const g2ExtractionConfig = {
		// 	sheetName: 'G-2 Habitat groups',
		// 	titleCellAddress: ['A1', 'AJ1', 'AU1'],
		// 	startCells: ['A2', 'AJ3', 'AU4'],
		// 	cellHeaders: {
		// 		A1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
		// 			'16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
		// 			'30', '31', '32'],
		// 		AJ1: ['On Site Habitat Group', 'Existing Area', 'Existing Value', 'Proposed Area On Site', 'Proposed Value On Site',
		// 		                    'On Site Area Change', 'On Site  Unit Change'],
		// 		AU1: ['Habitat Group', 'Group', 'Existing Area', 'Existing Value Lost', 'Proposed Area On Site', 'Proposed Value On Site',
		// 			'On Site Area Change', 'On Site  Unit Change', 'Proposed Area Off Site', 'Offsite Unit Change', 'unit change including offsite',
		// 			'units required offsite', 'area lost']
		// 	},
		// 	columnsToBeRemoved:{
		// 		A1: ['__EMPTY'],
		// 		AJ1: ['__EMPTY'],
		// 		AU1: ['__EMPTY']
		// 	},
		// 	substitutions: {
		// 			A1: {
		// 				'__EMPTY': 'Broad Habitat',
		// 				'__EMPTY_1': 'Proposed habitat',
		// 				'__EMPTY_3': 'Area (hectares)',
		// 				'__EMPTY_4': 'Habitat units delivered'
		// 			},
		// 			AJ1: {
		// 				'__EMPTY': 'Broad Habitat',
		// 				'__EMPTY_1': 'Proposed habitat',
		// 				'__EMPTY_3': 'Area (hectares)',
		// 				'__EMPTY_4': 'Habitat units delivered'
		// 			},
		// 			AU1: {
		// 				'__EMPTY': 'Broad Habitat',
		// 				'__EMPTY_1': 'Proposed habitat',
		// 				'__EMPTY_3': 'Area (hectares)',
		// 				'__EMPTY_4': 'Habitat units delivered'
		// 			}
		// 		}
		// };
		
		let workBook = await createWorkbook(readableStream);

		const response = await bNGMatricDataExtractor.extractHabitatGroup(workBook, habitatGroupExtractionConfig);
		expect(response).not.toBeFalsy();
		expect(response.allHabitatData.data.length).toBe(135);
		expect(response.hedgeGrowAndTrees.data.length).toBe(16);
		expect(response.riversAndStreams.data.length).toBe(7);
		expect(response.groupSubTotals.data.length).toBe(27);
		expect(response.distinctiveBandVeryHigh.data.length).toBe(20);
		expect(response.distinctiveBandHigh.data.length).toBe(42);
		expect(response.distinctiveBandMedium.data.length).toBe(27);
		expect(response.distinctiveBandLow.data.length).toBe(37);
		expect(response.distinctiveBandVeryLow.data.length).toBe(5);
	});
	
	let createWorkbook = (contentInputStream) => {
		return new Promise((resolve, reject) => {
			const data = [];
			contentInputStream.on('data', (chunk) => {
				data.push(chunk);
			});
			
			contentInputStream.on('end', () => {
				const workBook = xslx.read(Buffer.concat(data), {type: 'buffer'});
				resolve(workBook);
			})
			
			contentInputStream.on('error', (err) => {
				reject(err)
			})
			
		});
	}

})
