import {habitatEnhancementConfig} from '../configuration/habitat-enhancement';

class HabitatEnhancementService {
	
	#habitatEnhancement;
	
	constructor(sequelize) {
		this.#habitatEnhancement = sequelize.define("habitatEnhancement", habitatEnhancementConfig);
	}
	
	getHabitatEnhancement = () => {
		return this.#habitatEnhancement;
	}
	
	storeExtractedData = async (extractedData) => {
		await this.#habitatEnhancement.sync({ alter: true });
		const habitatEnhancementRecords = [];
		let applicationReference = extractedData.startPage['Planning application reference'];
		extractedData.offSiteHabitatEnhancement.forEach(enhancement => {
			const planningApplicationReference = applicationReference;
			const baselineHabitat = enhancement['Baseline habitat'];
			const totalHabitatArea = enhancement['Total habitat area'];
			const baselineDistinctivenessBand = enhancement['Baseline distinctiveness band'];
			const baselineDistinctivenessScore = enhancement['Baseline distinctiveness score'];
			const baselineConditionCategory = enhancement['Baseline condition category'];
			const baselineConditionScore = enhancement['Baseline condition score'];
			const baselineStrategicSignificanceCategory = enhancement['Baseline strategic significance category'];
			const baselineStrategicSignificanceScore = enhancement['Baseline strategic significance score'];
			const baselineHabitatUnits = enhancement['Baseline habitat units'];
			const suggestedActionToAddressHabitatLosses = enhancement['Suggested action to address habitat losses'];
			const conditionalDataValidation = enhancement['Conditional Data Validation'];
			const proposedBroadHabitat = enhancement['Proposed Broad Habitat'];
			const proposedHabitat = enhancement['Proposed Habitat'];
			const proposedHabitatPrePopulatedButCanBeOverridden = enhancement['Proposed habitat    (Pre-Populated but can be overridden)'];
			const distinctivenessChange = enhancement[' Distinctiveness change'];
			const conditionChange = enhancement['Condition change'];
			const strategicSignificance = enhancement['Strategic significance'];
			const strategicSignificance_1 = enhancement['Strategic significance_1'];
			const strategicPositionMultiplier = enhancement['Strategic position multiplier'];
			const standardTimeToTargetConditionYears = enhancement['Standard time to target condition/years'];
			const standardOrAdjustedTimeToTargetCondition = enhancement['Standard or adjusted time to target condition'];
			const finalTimeToTargetConditionYears = enhancement['Final time to target condition/years'];
			const finalTimeToTargetMultiplier = enhancement['Final time to target multiplier'];
			const difficultyOfEnhancementCategory = enhancement['Difficulty of enhancement category'];
			const appliedDifficulltyMultiplier = enhancement['Applied difficullty multiplier'];
			const difficulty = enhancement['Difficulty'];
			const difficultyMultiplierApplied = enhancement['Difficulty multiplier applied'];
			const spatialRiskCategory = enhancement['Spatial risk category\', \'Spatial risk multiplier'];
			const spatialRiskMultiplier = enhancement['Proposed habitat'];
			const areaHectares = enhancement['Area (hectares)'];
			const habitatUnitsDelivered = enhancement['Habitat units delivered'];
			const distinctiveness = enhancement['Distinctiveness'];
			const score = enhancement['Score'];
			const condition = enhancement['Condition'];
			const Score_1 = enhancement['Score_1'];
			
			habitatEnhancementRecords.push({
				planningApplicationReference,
				baselineHabitat,
				totalHabitatArea,
				baselineDistinctivenessBand,
				baselineDistinctivenessScore,
				baselineConditionCategory,
				baselineConditionScore,
				baselineStrategicSignificanceCategory,
				baselineStrategicSignificanceScore,
				baselineHabitatUnits,
				suggestedActionToAddressHabitatLosses,
				conditionalDataValidation,
				proposedBroadHabitat,
				proposedHabitat,
				proposedHabitatPrePopulatedButCanBeOverridden,
				distinctivenessChange,
				conditionChange,
				strategicSignificance,
				strategicSignificance_1,
				strategicPositionMultiplier,
				standardTimeToTargetConditionYears,
				standardOrAdjustedTimeToTargetCondition,
				finalTimeToTargetConditionYears,
				finalTimeToTargetMultiplier,
				difficultyOfEnhancementCategory,
				appliedDifficulltyMultiplier,
				difficulty,
				difficultyMultiplierApplied,
				spatialRiskCategory,
				spatialRiskMultiplier,
				areaHectares,
				habitatUnitsDelivered,
				distinctiveness,
				score,
				condition,
				Score_1
			});
		});
		const result =  await this.#habitatEnhancement.findAll({where: {planningApplicationReference: applicationReference}});
		if (result.length > 0) {
			await this.#habitatEnhancement.destroy({where: {planningApplicationReference: applicationReference}});
		}
		await this.#habitatEnhancement.bulkCreate(habitatEnhancementRecords);
	}
}
export default HabitatEnhancementService;
