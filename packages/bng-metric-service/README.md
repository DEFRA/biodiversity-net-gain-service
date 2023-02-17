# bng-metric-service
This package provides Biodiversity metric file extraction related functions. Configuration based extraction and conversion to JSON format is provided.
Extensible configuration based processing allows data to be extracted for different purposes.

# Extraction configuration available
| Sheet Name | Configuration Object used |
|-------------|--------------------------|
| Start | startExtractionConfig |
| v3.1 | |
| D-1 Off Site Habitat Baseline | d1OffSiteHabitatBaseline |
| D-2 Off Site Habitat Creation | d2OffSiteHabitatCreation |
| D-3 Off Site Habitat Enhancment | d3OffSiteHabitatEnhancement |
| E-1 Off Site Hedge Baseline | e1OffSiteHedgeBaseline |
| E-2 Off Site Hedge Creation | e2OffSiteHedgeCreation |
| E-3 Off Site Hedge Enhancement | e3OffSiteHedgeEnhancement |
| F-1 Off Site River Baseline | f1OffSiteRiverBaseline |
| F-2 Off Site River Creation | f2OffSiteRiverCreation |
| F-3 Off Site River Enhancement | f3OffSiteRiverEnhancement |
| v4.0 | |
| D-1 Off-Site Habitat Baseline | d1OffSiteHabitatBaselinev4 |
| D-2 Off-Site Habitat Creation | d2OffSiteHabitatCreationv4 |
| D-3 Off-Site Habitat Enhancment | d3OffSiteHabitatEnhancementv4 |
| E-1 Off-Site Hedge Baseline | e1OffSiteHedgeBaselinev4 |
| E-2 Off-Site Hedge Creation | e2OffSiteHedgeCreationv4 |
| E-3 Off-Site Hedge Enhancement | e3OffSiteHedgeEnhancementv4 |
| F-1 Off-Site Water'C Baseline | f1OffSiteWaterCBaselinev4 |
| F-2 Off-Site Water'C Creation | f2OffSiteWaterCCreationv4 |
| F-3 Off-Site WaterC Enhancement | f3OffSiteWaterCEnhancementv4 |


The list above will be updated as more configuration based extraction is added. When all configuration based extraction is available this line will be removed.

Note that the tool currently includes 3.1 extraction config, however going forwards 3.1 will not be accepted, and 4.0 will be the version in use.