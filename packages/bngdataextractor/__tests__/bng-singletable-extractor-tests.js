import fs from'fs';
import path from 'path';
import BNGMetrixSingleTableExtracrtor from '../src/extractors/bng-singletable-extractor.js';
import {
	habitatBaselineExtractionConfig, habitatCreationExtractionConfig,
	offSiteHabitatBaselineExtractionConfig, offSiteHabitatCreationExtractionConfig,
	enhancementTemporalExtractionConfig, habitatGroupExtractionConfig, startExtractionConfig, offSiteHabitatEnhancementExtractionConfig
} from '../src/extractors/extractionconfig/configuration.js';

describe('BNG data extractor test', () => {
	let readableStream = undefined;
	let bNGMetrixDataExtracrtor = undefined;
	
	beforeEach(() => {
		
		readableStream = fs.createReadStream(path.join(path.resolve(), '__tests__/metricfiles/biodiversity30.xlsm'));
		bNGMetrixDataExtracrtor = new BNGMetrixSingleTableExtracrtor();
		
	});
	
	afterEach(() => {
		
		readableStream = undefined;
		bNGMetrixDataExtracrtor = undefined;
		
	});
	
	it('should transfor excel stream to json for start', async () => {
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {start: startExtractionConfig});
		expect(response).not.toBeFalsy();
		expect(response.start['Project name']).toBe('Metric extraction Project');
		expect(response.start['Applicant']).toBe('Satoshi nakimoto');
		expect(response.start['Application type']).toBe('Garden Enhancement');
		expect(response.start['Planning application reference']).toBe(123456789);
		expect(response.start['Assessor']).toBe('Paul Mcomick');
		expect(response.start['Reviewer']).toBe('Mark keeling');
		expect(response.start['Metric version']).toBe(3);
		expect(response.start['Assessment date']).toBe(44491);
		expect(response.start['Planning authority reviewer']).toBe('Nick allen');
		expect(response.start['Planning authority']).toBe('Ajinkya Jawalkar');
	})
	
	it('should transform excel stream to json for A-1 Site Habitat Baseline', async () => {
		
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {habitatBaseline: habitatBaselineExtractionConfig});
		expect(response).not.toBeFalsy();
		expect(response.habitatBaseline.length).toBe(7);
		expect(response.habitatBaseline[0]['Broad habitat']).toBe('Cropland');
		expect(response.habitatBaseline[1]['Broad habitat']).toBe('Woodland and forest');
		expect(response.habitatBaseline[2]['Broad habitat']).toBe('Cropland');
		expect(response.habitatBaseline[3]['Broad habitat']).toBe('Cropland');
		expect(response.habitatBaseline[4]['Broad habitat']).toBe('Grassland');
		expect(response.habitatBaseline[5]['Broad habitat']).toBe('Grassland');
	});
	
	it('should transform excel stream to json A-2 Site Habitat Creation', async () => {
		
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {habitatCreation: habitatCreationExtractionConfig});
		expect(response).not.toBeFalsy();
		expect(response.habitatCreation.length).toBe(4);
		expect(response.habitatCreation[0]['Broad Habitat']).toBe('Grassland');
		expect(response.habitatCreation[1]['Broad Habitat']).toBe('Urban');
		expect(response.habitatCreation[2]['Broad Habitat']).toBe('Urban');
		
	});
	
	it('should transform excel stream to json D-1 Off Site Habitat Baseline', async () => {
		
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {offSiteHabitat: offSiteHabitatBaselineExtractionConfig});
		expect(response).not.toBeFalsy();
		expect(response.offSiteHabitat.length).toBe(2);
		expect(response.offSiteHabitat[0]['Broad habitat']).toBe('Cropland');
		expect(response.offSiteHabitat[0]['Habitat type']).toBe('Cereal crops');
		expect(response.offSiteHabitat[0]['Area (hectares)']).toBe(6);
		
	});
	
	it('should transform excel stream to json D-2 Off Site Habitat Creation', async () => {
		
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {offSiteHabitatCreation: offSiteHabitatCreationExtractionConfig});
		expect(response).not.toBeFalsy();
		expect(response.offSiteHabitatCreation.length).toBe(3);
		expect(response.offSiteHabitatCreation[0]['Broad Habitat']).toBe('Heathland and shrub');
		expect(response.offSiteHabitatCreation[0]['Proposed habitat']).toBe('Mixed scrub');
		expect(response.offSiteHabitatCreation[0]['Area (hectares)']).toBe(5);
		
	});
	//TODO Failing test due to data extraction not being correct.
	it('should transform excel stream to json D-3 Off Site Habitat Enhancement', async () => {
		
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {offSiteHabitatEnhancement: offSiteHabitatEnhancementExtractionConfig});
	 	expect(response).not.toBeFalsy();
		
		// const d3Headers = ['Proposed Broad Habitat', 'Proposed Habitat'];
		// const d3ColmnsToRemove = ['__EMPTY'];
		// const d3ExtractionConfig = {
		// 	sheetName: 'D-3 Off Site Habitat Enhancment',
		// 	titleCellAddress: 'E3',
		// 	cellRange: 'D10:AA19',
		// 	cellHeaders: d3Headers,
		// 	columnsToBeRemoved: d3ColmnsToRemove,
		// 	substitutions: {
		// 		'__EMPTY': 'Broad Habitat',
		// 		'__EMPTY_1': 'Proposed habitat',
		// 		'__EMPTY_3': 'Area (hectares)',
		// 		'__EMPTY_4': 'Habitat units delivered'
		// 	}
		// };
		//
		// const response = await bNGMetrixDataExtracrtor.streamToJson(readableStream, d3ExtractionConfig);
		// expect(response).not.toBeFalsy();
		// expect(response.length).toBe(1);
	});
	
	it('should transform excel stream to json G-5 Enhancement Temporal', async () => {
		
		const response = await bNGMetrixDataExtracrtor.extractContent(readableStream, {enhancementTemporal: enhancementTemporalExtractionConfig});
		expect(response).not.toBeFalsy();
		expect(response.enhancementTemporal.length).toBe(130);
		expect(response.enhancementTemporal[0]['Start cond']).toBe('Target cond');
		expect(response.enhancementTemporal[0]['Lower Distinctiveness Habitat']).toBe('N/A - Other');
		expect(response.enhancementTemporal[0]['Lower Distinctiveness Habitat_1']).toBe('N/A -Agricultural');
		expect(response.enhancementTemporal[0]['Lower Distinctiveness Habitat_2']).toBe('Poor');
		expect(response.enhancementTemporal[0]['Lower Distinctiveness Habitat_3']).toBe('Fairly Poor');
		
	});

})
