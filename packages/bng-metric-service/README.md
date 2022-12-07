# bng-metric-service
This repo provides Metric file extraction related functions , used for extracting data from metric file to JSON format dynamically by reffering to the configurations:

* This module is referred from the alfa respository and still need to work on different configurations required for the sheets from metric file

# Used dependencies
    lodash | ^4.17.21 | Lodash is a JavaScript library that helps programmers write more concise and maintainable JavaScript. It can be broken down into several main areas: Utilities: for simplifying common programming tasks such as determining type as well as simplifying math operations

    xlsx | ^0.17.2 | The SheetJS Community Edition offers battle-tested open-source solutions for extracting useful data from almost any complex spreadsheet and generating new spreadsheets that will work with legacy and modern software alike.

# License used
    OGL-UK-3.0 | Department for Environment, Food and Rural Affairs <https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs>

# Extraction configuration available for following sheets from metric file [For more extracting data from other sheets expected to add configuration as per the format of the sheet]
[Sheet Name | (Configuration Object used)]
    - Start | (startExtractionConfig)
    - A-1 Site Habitat Baseline | (habitatBaselineExtractionConfig)

