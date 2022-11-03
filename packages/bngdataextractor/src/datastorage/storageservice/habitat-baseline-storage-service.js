import {habitatBaselineConfig} from '../configuration/habitat-baseline.js'

class HabitatBaselineStorageService {
	
	#habitatBaseline;
	
	constructor(sequelize) {
		this.#habitatBaseline = sequelize.define("habitatBaseline", habitatBaselineConfig)
	}
	
	getHabitatBaseline = () => {
		return this.#habitatBaseline;
	}

	storeExtractedData = async (extractedData) => {
		await this.#habitatBaseline.sync({ alter: true });
		let habitatRecord = [];
		let applicationReference = extractedData.startPage['Planning application reference'];
		extractedData.siteHabitatBaseline.forEach(habita => {
			const planningApplicationReference = applicationReference;
			const broadHabitat = habita['Broad habitat'];
			const habitatType = habita[' Habitat type'];
			const areaHectares = habita['Area (hectares)'];
			const distinctiveness = habita['Distinctiveness'];
			const score = habita['Score'];
			const condition = habita['Condition '];
			const score_1 = habita['Score_1'];
			const strategicSignificance = habita['Strategic significance'];
			const strategicSignificance_1 = habita['Strategic significance_1'];
			const strategicSignificanceMultiplier = habita['Strategic Significance multiplier'];
			const totalHabitatUnits = habita['Total habitat units'];
			const baselineUnitsRetained = habita['Baseline units retained'];
			const baselineUnitsEnhanced = habita['Baseline units enhanced'];
			const areaLost = habita['Area lost'];
			const unitsLost = habita['Units lost'];

			habitatRecord.push({
					planningApplicationReference,
					broadHabitat,
					habitatType,
					areaHectares,
					distinctiveness,
					score,
					condition,
					score_1,
					strategicSignificance,
					strategicSignificance_1,
					strategicSignificanceMultiplier,
					totalHabitatUnits,
					baselineUnitsRetained,
					baselineUnitsEnhanced,
					areaLost,
					unitsLost
				});
			
		});
		const result =  await this.#habitatBaseline.findAll({where: {planningApplicationReference: applicationReference}});
		if (result.length > 0) {
			await this.#habitatBaseline.destroy({where: {planningApplicationReference: applicationReference}});
		}
		await this.#habitatBaseline.bulkCreate(habitatRecord);
	}
}
export default HabitatBaselineStorageService;
