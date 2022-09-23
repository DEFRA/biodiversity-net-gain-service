
 

INSERT INTO facility.company_type (id, company_type) VALUES (1, 'UK company');

INSERT INTO facility.company_type (id, company_type) VALUES (2, 'Overseas company');


INSERT INTO party.contact_type (id, contact_type) VALUES (1, 'Organisation contact');

INSERT INTO party.contact_type (id, contact_type) VALUES (2, 'Landowner');


INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (1, 1, 'Initial registration', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (2, 6, 'Habitat enhancement work start date', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (3, 6, '30 Year management and monitoring period', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (4, 6, 'Baseline survey date', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (5, 5, 'Legal agreement start date', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (6, 5, 'Legal agreement end date', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (7, 5, 'Legal agreement length', NULL, NULL);

INSERT INTO event.key_date_type (id, workstream_section_id, key_date_type, days_after_start_sla, years_after_start_sla) VALUES (8, 6, 'Registration completion date', NULL, NULL);


INSERT INTO document.type (id, document_type, max_size_megabytes) VALUES (1, 'Land boundary document', 10);

INSERT INTO document.type (id, document_type, max_size_megabytes) VALUES (2, 'Certificate of ownership', 10);

INSERT INTO document.type (id, document_type, max_size_megabytes) VALUES (3, 'BNG metric 3.1 calculations spreadsheet', 10);

INSERT INTO document.type (id, document_type, max_size_megabytes) VALUES (4, 'Habitat Management and Monitoring plan', 10);

INSERT INTO document.type (id, document_type, max_size_megabytes) VALUES (5, 'Legal agreement', 10);


INSERT INTO project.workstream (id, name, abbreviation) VALUES (1, 'Land Owner', 'LO');

INSERT INTO project.workstream (id, name, abbreviation) VALUES (2, 'Developer', 'DE');

INSERT INTO project.workstream (id, name, abbreviation) VALUES (3, 'Financial', 'FI');

INSERT INTO project.workstream (id, name, abbreviation) VALUES (4, 'Reporting', 'RE');

INSERT INTO project.workstream (id, name, abbreviation) VALUES (5, 'Allocation', 'AL');


INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (1, 1, 'Initial registration', 'LO01');

INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (2, 1, 'Land boundary', 'LO02');

INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (3, 1, 'Land ownshership', 'LO03');

INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (4, 1, 'Metric details', 'LO04');

INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (5, 1, 'Legal agreement', 'LO06');

INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (6, 1, 'Habitat management and monitoring', 'LO07');

INSERT INTO project.workstream_section (id, workstream_id, section_name, abbreviation) VALUES (7, 1, 'Pay and submit', 'LO08');


INSERT INTO location.address_type (id, address_type) VALUES (1, 'Organisation contact');

INSERT INTO location.address_type (id, address_type) VALUES (2, 'Landowner');


INSERT INTO facility.tenure_type (id, tenure) VALUES (1, 'freehold');

INSERT INTO facility.tenure_type (id, tenure) VALUES (2, 'leasehold');

INSERT INTO facility.tenure_type (id, tenure) VALUES (3, 'unknown');
 
