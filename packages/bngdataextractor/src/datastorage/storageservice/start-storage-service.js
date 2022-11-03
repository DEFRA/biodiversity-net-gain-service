import {startConfig} from '../configuration/start-sheet.js';

class StartStorageService {
	
	#startStorage;
	
	constructor(sequelize) {
		this.#startStorage = sequelize.define("startSheet", startConfig);
	}
	
	getStartStorage = () => {
		return this.#startStorage;
	}
	
	storeExtractedData = async (extractedData) => {
		await this.#startStorage.sync({ alter: true });
		const planningAuthority = extractedData.startPage['Planning authority'];
		const projectName = extractedData.startPage['Project name'];
		const applicant = extractedData.startPage['Applicant'];
		const applicationType = extractedData.startPage['Application type'];
		const planningApplicationReference = extractedData.startPage['Planning application reference'];
		const accessor = extractedData.startPage['Assessor'];
		const reviewer = extractedData.startPage['Reviewer'];
		const metricVersion = extractedData.startPage['Metric version'];
		const assessmentDate = extractedData.startPage['Assessment date'];
		const planningAuthorityReviewer = extractedData.startPage['Planning authority reviewer'];
		const result =  await this.#startStorage.findOne({where: {planningApplicationReference: planningApplicationReference}});

		if (!result) {
			return await this.#startStorage.create({
				planningAuthority,
				projectName,
				applicant,
				applicationType,
				planningApplicationReference,
				accessor,
				reviewer,
				metricVersion,
				assessmentDate,
				planningAuthorityReviewer
			});
		}else{
			return await this.#startStorage.update({
				planningAuthority,
				projectName,
				applicant,
				applicationType,
				planningApplicationReference,
				accessor,
				reviewer,
				metricVersion,
				assessmentDate,
				planningAuthorityReviewer
			}, {where: {planningApplicationReference: planningApplicationReference}});
		}
	}
}
export default StartStorageService;
