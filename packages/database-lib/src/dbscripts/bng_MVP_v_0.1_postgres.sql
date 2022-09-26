SET SCHEMA 'public';
/* SQLINES DEMO *** ema [activity]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA activity;
/* SQLINES DEMO *** ema [address]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA address;
/* SQLINES DEMO *** ema [agreement]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA agreement;
/* SQLINES DEMO *** ema [assessment]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA assessment;
/* SQLINES DEMO *** ema [asset]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA asset;
/* SQLINES DEMO *** ema [case]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA case_schema;
/* SQLINES DEMO *** ema [communication]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA communication;
/* SQLINES DEMO *** ema [contact]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA contact;
/* SQLINES DEMO *** ema [control]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA control;
/* SQLINES DEMO *** ema [document]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA document;
/* SQLINES DEMO *** ema [event]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA event;
/* SQLINES DEMO *** ema [facility]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA facility;
/* SQLINES DEMO *** ema [finance]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA finance;
/* SQLINES DEMO *** ema [location]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA location;
/* SQLINES DEMO *** ema [lookup]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA lookup;
/* SQLINES DEMO *** ema [party]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA party;
/* SQLINES DEMO *** ema [project]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA project;
/* SQLINES DEMO *** ema [request]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA request;
/* SQLINES DEMO *** ema [service]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA service;
/* SQLINES DEMO *** ema [territory]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA territory;
/* SQLINES DEMO *** ema [time]    Script Date: 09/09/2022 09:13:08 ******/
CREATE SCHEMA time;
/* SQLINES DEMO *** le [agreement].[habitat_management]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE agreement.habitat_management(
                                               id int NOT NULL,
                                               reg_id int NOT NULL,
                                               contact_id int NOT NULL,
                                               metric_document_id int NOT NULL,
                                               HMMP_document_id int NOT NULL,
                                               habitat_work_start_date_id int NOT NULL,
                                               thirty_year_date_id int NULL,
                                               company_org_BNG_id int NULL,
                                               validate_complete Boolean NOT NULL,
                                               date_created Timestamp(3) NOT NULL,
    CONSTRAINT PK_habitat_management PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [agreement].[land_ownership]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE agreement.land_ownership(
                                           id int NOT NULL,
                                           reg_id int NOT NULL,
                                           contact_id int NOT NULL,
                                           certificate_document_id int NOT NULL,
                                           landowner_contact_id int NOT NULL,
                                           landowner_consent_declaration Boolean NOT NULL,
                                           landowner_address_id int NULL,
                                           validate_complete Boolean NOT NULL,
                                           date_created date NOT NULL,
                                           CONSTRAINT PK_land_ownership PRIMARY KEY
(
                                           id
)
    );
/* SQLINES DEMO *** le [agreement].[legal_agreement]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE agreement.legal_agreement(
                                            id int NOT NULL,
                                            reg_id int NOT NULL,
                                            contact_id int NOT NULL,
                                            legal_agreement_document_id int NOT NULL,
                                            legal_agreement_party_id int NOT NULL,
                                            party_role_id int NOT NULL,
                                            legal_agreement_start_date_id int NOT NULL,
                                            legal_agreement_end_date_id int NOT NULL,
                                            legal_agreement_length int NOT NULL,
                                            validate_complete Boolean NOT NULL,
                                            date_created date NOT NULL,
                                            CONSTRAINT PK_legal_agreement PRIMARY KEY
(
                                            id
)
    );
/* SQLINES DEMO *** le [agreement].[metric]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE agreement.metric(
                                   id int NOT NULL,
                                   reg_id int NOT NULL,
                                   contact_id int NOT NULL,
                                   validate_complete Boolean NOT NULL,
                                   date_created date NOT NULL,
                                   CONSTRAINT PK_metric PRIMARY KEY
(
                                   id
)
    );
/* SQLINES DEMO *** le [document].[registration_document]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE document.registration_document(
                                                 id int NOT NULL,
                                                 document_type_id int NOT NULL,
                                                 reg_id int NOT NULL,
                                                 doc_type_id int NOT NULL,
                                                 storage_path varchar(500) NOT NULL,
    CONSTRAINT PK_registration_document PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [document].[type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE document.type(
                                id int NOT NULL,
                                document_type varchar(100) NOT NULL,
    max_size_megabytes int NOT NULL,
    CONSTRAINT PK_document_type PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [event].[key_date]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE event.key_date(
                                 id int NOT NULL,
                                 reg_id int NOT NULL,
                                 key_date_type_id int NULL,
                                 key_date date NOT NULL,
                                 CONSTRAINT PK_key_date_1 PRIMARY KEY
(
                                 id
)
    );
/* SQLINES DEMO *** le [event].[key_date_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE event.key_date_type(
                                      id int NOT NULL,
                                      workstream_section_id int NULL,
                                      key_date_type varchar(50) NOT NULL,
    days_after_start_sla int NULL,
    years_after_start_sla int NULL,
    CONSTRAINT PK_key_date PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [event].[registration]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE event.registration(
                                     id int NOT NULL,
                                     company_id int NOT NULL,
                                     contact_id int NOT NULL,
                                     create_date Timestamp(3) NOT NULL,
    validate_complete Boolean NOT NULL,
    CONSTRAINT PK_registration PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [event].[workstream_section_completed]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE event.workstream_section_completed(
                                                     id int NOT NULL,
                                                     reg_id int NOT NULL,
                                                     workstream_section_id int NOT NULL,
                                                     completed Boolean NOT NULL,
                                                     date_completed Timestamp(3) NULL,
    CONSTRAINT PK_workstream_section_completed PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [facility].[company]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE facility.company(
                                   id int NOT NULL,
                                   company_type_id Smallint NOT NULL,
                                   companies_house_status Boolean NOT NULL,
                                   dissolution_date Timestamp(3) NOT NULL,
    incorporation_date Timestamp(3) NULL,
    is_uk Boolean NOT NULL,
    trading_name varchar(200) NULL,
    business_activity varchar(100) NOT NULL,
    assurance_level_id int NOT NULL,
    account_id int NULL,
    status Boolean NULL,
    type varchar(100) NULL,
    primary_contact_id int NOT NULL,
    companies_house_validated Boolean NULL,
    CONSTRAINT PK_company PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [facility].[company_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE facility.company_type(
                                        id Smallint NOT NULL,
                                        company_type varchar(20) NOT NULL,
    CONSTRAINT PK_company_type PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [facility].[tenure_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE facility.tenure_type(
                                       id Smallint NOT NULL,
                                       tenure varchar(20) NOT NULL,
    CONSTRAINT PK_tenure PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [finance].[pay_submit]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE finance.pay_submit(
                                     id int NOT NULL,
                                     reg_id int NOT NULL,
                                     contact_id int NOT NULL,
                                     validate_complete Boolean NOT NULL,
                                     date_created Timestamp(3) NOT NULL,
    CONSTRAINT PK_pay_submit PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [location].[address]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE location.address(
                                   id int NOT NULL,
                                   address_type_id int NOT NULL,
                                   property_street_name varchar(100) NOT NULL,
    property_name varchar(50) NOT NULL,
    district varchar(100) NOT NULL,
    region_id int NOT NULL,
    postcode varchar(10) NOT NULL,
    country_id int NOT NULL,
    CONSTRAINT PK_address PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [location].[address_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE location.address_type(
                                        id int NOT NULL,
                                        address_type varchar(20) NOT NULL,
    CONSTRAINT PK_address_type PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [location].[country]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE location.country(
                                   id int NOT NULL,
                                   country varchar(200) NOT NULL,
    CONSTRAINT PK_country PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [location].[land_boundary]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE location.land_boundary(
                                         id int NOT NULL,
                                         reg_id int NOT NULL,
                                         contact_id int NOT NULL,
                                         grid_reference varchar(500) NOT NULL,
    hectares int NOT NULL,
    landowner__address_id int NULL,
    landowner_consent_declaration Boolean NOT NULL,
    landowner_address_id int NOT NULL,
    HM_land_registry_title_number int NULL,
    validate_completed Boolean NULL,
    CONSTRAINT PK_land_boundary PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [location].[region]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE location.region(
                                  id int NOT NULL,
                                  region varchar(100) NOT NULL,
    CONSTRAINT PK_region PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [party].[contact]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE party.contact(
                                id int NOT NULL,
                                contact_type_id int NOT NULL,
                                title_id Smallint NOT NULL,
                                first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    birth_date Timestamp(3) NULL,
    death_date Timestamp(3) NULL,
    description varchar(100) NULL,
    gender_id Smallint NOT NULL,
    primary_email_address varchar(200) NOT NULL,
    secondary_email_address varchar(200) NULL,
    telephone_number varchar(50) NOT NULL,
    assurance_level_id int NULL,
    CONSTRAINT PK_contact PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [party].[contact_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE party.contact_type(
                                     id int NOT NULL,
                                     contact_type varchar(20) NOT NULL,
    CONSTRAINT PK_contact_type PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [party].[gender_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE party.gender_type(
                                    id Smallint NOT NULL,
                                    gender varchar(20) NOT NULL,
    CONSTRAINT PK_gender_type PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [party].[party_role]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE party.party_role(
                                   id int NOT NULL,
                                   role_type varchar(50) NOT NULL,
    CONSTRAINT PK_party_role PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [party].[title_type]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE party.title_type(
                                   id Smallint NOT NULL,
                                   title varchar(20) NOT NULL,
    CONSTRAINT PK_title_type PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [project].[workstream]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE project.workstream(
                                     id int NOT NULL,
                                     name varchar(100) NOT NULL,
    abbreviation Char(2) NOT NULL,
    CONSTRAINT PK_workstream PRIMARY KEY
(
    id
)
    );
/* SQLINES DEMO *** le [project].[workstream_section]    Script Date: 09/09/2022 09:13:08 ******/
/* SET ANSI_NULLS ON */

/* SET QUOTED_IDENTIFIER ON */

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE TABLE project.workstream_section(
                                             id int NOT NULL,
                                             workstream_id int NOT NULL,
                                             section_name varchar(100) NOT NULL,
    abbreviation Char(4) NOT NULL,
    CONSTRAINT PK_workstream_section PRIMARY KEY
(
    id
)
    );

ALTER TABLE agreement.habitat_management  ADD  CONSTRAINT FK_habitat_management_company FOREIGN KEY(company_org_BNG_id)
    REFERENCES facility.company (id);

ALTER TABLE agreement.habitat_management VALIDATE CONSTRAINT FK_habitat_management_company;

ALTER TABLE agreement.habitat_management  ADD  CONSTRAINT FK_habitat_management_contact FOREIGN KEY(contact_id)
    REFERENCES party.contact (id);

ALTER TABLE agreement.habitat_management VALIDATE CONSTRAINT FK_habitat_management_contact;

ALTER TABLE agreement.habitat_management  ADD  CONSTRAINT FK_habitat_management_key_date FOREIGN KEY(thirty_year_date_id)
    REFERENCES event.key_date (id);

ALTER TABLE agreement.habitat_management VALIDATE CONSTRAINT FK_habitat_management_key_date;

ALTER TABLE agreement.habitat_management  ADD  CONSTRAINT FK_habitat_management_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE agreement.habitat_management VALIDATE CONSTRAINT FK_habitat_management_registration;

ALTER TABLE agreement.habitat_management  ADD  CONSTRAINT FK_habitat_management_registration_document FOREIGN KEY(metric_document_id)
    REFERENCES document.registration_document (id);

ALTER TABLE agreement.habitat_management VALIDATE CONSTRAINT FK_habitat_management_registration_document;

ALTER TABLE agreement.habitat_management  ADD  CONSTRAINT FK_habitat_management_type FOREIGN KEY(HMMP_document_id)
    REFERENCES document.type (id);

ALTER TABLE agreement.habitat_management VALIDATE CONSTRAINT FK_habitat_management_type;

ALTER TABLE agreement.land_ownership  ADD  CONSTRAINT FK_land_ownership_address FOREIGN KEY(landowner_address_id)
    REFERENCES location.address (id);

ALTER TABLE agreement.land_ownership VALIDATE CONSTRAINT FK_land_ownership_address;

ALTER TABLE agreement.land_ownership  ADD  CONSTRAINT FK_land_ownership_contact FOREIGN KEY(contact_id)
    REFERENCES party.contact (id);

ALTER TABLE agreement.land_ownership VALIDATE CONSTRAINT FK_land_ownership_contact;

ALTER TABLE agreement.land_ownership  ADD  CONSTRAINT FK_land_ownership_contact1 FOREIGN KEY(landowner_contact_id)
    REFERENCES party.contact (id);

ALTER TABLE agreement.land_ownership VALIDATE CONSTRAINT FK_land_ownership_contact1;

ALTER TABLE agreement.land_ownership  ADD  CONSTRAINT FK_land_ownership_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE agreement.land_ownership VALIDATE CONSTRAINT FK_land_ownership_registration;

ALTER TABLE agreement.land_ownership  ADD  CONSTRAINT FK_land_ownership_registration_document FOREIGN KEY(certificate_document_id)
    REFERENCES document.registration_document (id);

ALTER TABLE agreement.land_ownership VALIDATE CONSTRAINT FK_land_ownership_registration_document;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_contact FOREIGN KEY(contact_id)
    REFERENCES party.contact (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_contact;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_contact1 FOREIGN KEY(legal_agreement_party_id)
    REFERENCES party.contact (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_contact1;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_key_date FOREIGN KEY(legal_agreement_start_date_id)
    REFERENCES event.key_date (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_key_date;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_key_date1 FOREIGN KEY(legal_agreement_end_date_id)
    REFERENCES event.key_date (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_key_date1;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_party_role FOREIGN KEY(party_role_id)
    REFERENCES party.party_role (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_party_role;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_registration;

ALTER TABLE agreement.legal_agreement  ADD  CONSTRAINT FK_legal_agreement_registration_document FOREIGN KEY(legal_agreement_document_id)
    REFERENCES document.registration_document (id);

ALTER TABLE agreement.legal_agreement VALIDATE CONSTRAINT FK_legal_agreement_registration_document;

ALTER TABLE agreement.metric  ADD  CONSTRAINT FK_metric_contact FOREIGN KEY(contact_id)
    REFERENCES party.contact (id);

ALTER TABLE agreement.metric VALIDATE CONSTRAINT FK_metric_contact;

ALTER TABLE agreement.metric  ADD  CONSTRAINT FK_metric_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE agreement.metric VALIDATE CONSTRAINT FK_metric_registration;

ALTER TABLE document.registration_document  ADD  CONSTRAINT FK_registration_document_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE document.registration_document VALIDATE CONSTRAINT FK_registration_document_registration;

ALTER TABLE document.registration_document  ADD  CONSTRAINT FK_registration_document_type FOREIGN KEY(document_type_id)
    REFERENCES document.type (id);

ALTER TABLE document.registration_document VALIDATE CONSTRAINT FK_registration_document_type;

ALTER TABLE event.key_date  ADD  CONSTRAINT FK_key_date_key_date_type FOREIGN KEY(key_date_type_id)
    REFERENCES event.key_date_type (id);

ALTER TABLE event.key_date VALIDATE CONSTRAINT FK_key_date_key_date_type;

ALTER TABLE event.key_date  ADD  CONSTRAINT FK_key_date_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE event.key_date VALIDATE CONSTRAINT FK_key_date_registration;

ALTER TABLE event.registration  ADD  CONSTRAINT FK_registration_company FOREIGN KEY(company_id)
    REFERENCES facility.company (id);

ALTER TABLE event.registration VALIDATE CONSTRAINT FK_registration_company;

ALTER TABLE event.workstream_section_completed  ADD  CONSTRAINT FK_workstream_section_completed_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE event.workstream_section_completed VALIDATE CONSTRAINT FK_workstream_section_completed_registration;

ALTER TABLE event.workstream_section_completed  ADD  CONSTRAINT FK_workstream_section_completed_workstream_section FOREIGN KEY(workstream_section_id)
    REFERENCES project.workstream_section (id);

ALTER TABLE event.workstream_section_completed VALIDATE CONSTRAINT FK_workstream_section_completed_workstream_section;

ALTER TABLE facility.company  ADD  CONSTRAINT FK_company_company_type FOREIGN KEY(company_type_id)
    REFERENCES facility.company_type (id);

ALTER TABLE facility.company VALIDATE CONSTRAINT FK_company_company_type;

ALTER TABLE facility.company  ADD  CONSTRAINT FK_company_contact FOREIGN KEY(primary_contact_id)
    REFERENCES party.contact (id);

ALTER TABLE facility.company VALIDATE CONSTRAINT FK_company_contact;

ALTER TABLE finance.pay_submit  ADD  CONSTRAINT FK_pay_submit_contact FOREIGN KEY(contact_id)
    REFERENCES party.contact (id);

ALTER TABLE finance.pay_submit VALIDATE CONSTRAINT FK_pay_submit_contact;

ALTER TABLE finance.pay_submit  ADD  CONSTRAINT FK_pay_submit_registration FOREIGN KEY(reg_id)
    REFERENCES event.registration (id);

ALTER TABLE finance.pay_submit VALIDATE CONSTRAINT FK_pay_submit_registration;

ALTER TABLE location.address  ADD  CONSTRAINT FK_address_address_type FOREIGN KEY(address_type_id)
    REFERENCES location.address_type (id);

ALTER TABLE location.address VALIDATE CONSTRAINT FK_address_address_type;

ALTER TABLE location.address  ADD  CONSTRAINT FK_address_country FOREIGN KEY(country_id)
    REFERENCES location.country (id);

ALTER TABLE location.address VALIDATE CONSTRAINT FK_address_country;

ALTER TABLE location.address  ADD  CONSTRAINT FK_address_region FOREIGN KEY(region_id)
    REFERENCES location.region (id);

ALTER TABLE location.address VALIDATE CONSTRAINT FK_address_region;

ALTER TABLE location.land_boundary  ADD  CONSTRAINT FK_land_boundary_address FOREIGN KEY(landowner__address_id)
    REFERENCES location.address (id);

ALTER TABLE location.land_boundary VALIDATE CONSTRAINT FK_land_boundary_address;

ALTER TABLE location.land_boundary  ADD  CONSTRAINT FK_land_boundary_contact FOREIGN KEY(contact_id)
    REFERENCES party.contact (id);

ALTER TABLE location.land_boundary VALIDATE CONSTRAINT FK_land_boundary_contact;

ALTER TABLE location.land_boundary  ADD  CONSTRAINT FK_land_boundary_registration FOREIGN KEY(id)
    REFERENCES event.registration (id);

ALTER TABLE location.land_boundary VALIDATE CONSTRAINT FK_land_boundary_registration;

ALTER TABLE party.contact  ADD  CONSTRAINT FK_contact_contact_type FOREIGN KEY(contact_type_id)
    REFERENCES party.contact_type (id);

ALTER TABLE party.contact VALIDATE CONSTRAINT FK_contact_contact_type;

ALTER TABLE party.contact  ADD  CONSTRAINT FK_contact_gender_type FOREIGN KEY(gender_id)
    REFERENCES party.gender_type (id);

ALTER TABLE party.contact VALIDATE CONSTRAINT FK_contact_gender_type;

ALTER TABLE party.contact  ADD  CONSTRAINT FK_contact_title_type FOREIGN KEY(title_id)
    REFERENCES party.title_type (id);

ALTER TABLE party.contact VALIDATE CONSTRAINT FK_contact_title_type;

ALTER TABLE project.workstream_section  ADD  CONSTRAINT FK_workstream_section_workstream FOREIGN KEY(workstream_id)
    REFERENCES project.workstream (id);

ALTER TABLE project.workstream_section VALIDATE CONSTRAINT FK_workstream_section_workstream;

SET SCHEMA 'master';

-- ALTER DATABASE Biodiversity_MVP SET  READ_WRITE


 
