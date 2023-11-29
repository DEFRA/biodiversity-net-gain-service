import applicationSession from '../../__mocks__/application-session.js'
import application from '../application.js'
import constants from '../../utils/constants.js'
import applicant from '../../__mocks__/applicant.js'

describe('application', () => {
  it('Should set the geojson file if a WGS84 geospatial file has been uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
    session.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'test-location/file.geojson')
    session.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, '0.05')
    session.set(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION, 'test-location/reprojectedToOsgb36/file.geojson')
    session.set(constants.redisKeys.REPROJECTED_GEOSPATIAL_FILE_SIZE, '0.051')
    session.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, 'ST123456')
    session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files[4].fileType).toEqual('geojson')
    expect(app.landownerGainSiteRegistration.files[4].fileSize).toEqual('0.051')
    expect(app.landownerGainSiteRegistration.files[4].fileName).toEqual('file.geojson')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('ST123456')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  })
  it('Should set the legal agreement files', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement.doc',
        fileSize: 0.01,
        fileType: 'application/msword',
        id: '1'

      },
      {
        location: '800376c7-8652-4906-8848-70a774578dfe/legal-agreement/legal-agreement1.pdf',
        fileSize: 0.01,
        fileType: 'application/pdf',
        id: '2'
      }
    ])
    const app = application(session, applicant)
    const legalAgreementFiles = app.landownerGainSiteRegistration.files.filter(
      (file) => file.fileType === 'legal-agreement'
    )
    expect(legalAgreementFiles.length).toEqual(2)
    expect(legalAgreementFiles[0].fileName).toEqual('legal-agreement.doc')
  })
  it('Should set the geojson file if an OSGB36 geospatial file has been uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, undefined)
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
    session.set(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION, 'test-location/file.geojson')
    session.set(constants.redisKeys.GEOSPATIAL_FILE_SIZE, '0.05')
    session.set(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE, 'ST123456')
    session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files[4].fileType).toEqual('geojson')
    expect(app.landownerGainSiteRegistration.files[4].fileSize).toEqual('0.05')
    expect(app.landownerGainSiteRegistration.files[4].fileName).toEqual('file.geojson')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('ST123456')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  })
  it('Should set the land boundary file if no geospatial file has been uploaded', () => {
    const session = applicationSession()
    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.files[4].fileType).toEqual('land-boundary')
    expect(app.landownerGainSiteRegistration.files[4].fileSize).toEqual(0.01)
    expect(app.landownerGainSiteRegistration.files[4].fileName).toEqual('legal-agreement.doc')
    expect(app.landownerGainSiteRegistration.landBoundaryGridReference).toEqual('SE170441')
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(2)
  })
  it('Should correctly show planningObligationLPAs and should not include conservationCovernantResponsibleBodies when LEGAL_AGREEMENT_DOCUMENT_TYPE 759150000', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150000')
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration).not.toHaveProperty('conservationCovernantResponsibleBodies')
    expect(app.landownerGainSiteRegistration).toHaveProperty('planningObligationLPAs')
    expect(app.landownerGainSiteRegistration.planningObligationLPAs).toBeInstanceOf(Array)
    expect(app.landownerGainSiteRegistration.planningObligationLPAs.length).toBeGreaterThan(1)
  })
  it('Should correctly show legalAgreementResponsibleBodies and should not include planningObligationLPAs  when LEGAL_AGREEMENT_DOCUMENT_TYPE 759150001', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, '759150001')
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration).not.toHaveProperty('planningObligationLPAs')
    expect(app.landownerGainSiteRegistration).toHaveProperty('conservationCovernantResponsibleBodies')
    expect(app.landownerGainSiteRegistration.conservationCovernantResponsibleBodies).toBeInstanceOf(Array)
    expect(app.landownerGainSiteRegistration.conservationCovernantResponsibleBodies.length).toBeGreaterThan(1)
  })
  it('Should set land boundary file if no geospatial file is uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, 'application/pdf')
    session.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, '0.01')
    session.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, 'test-location/legal-agreement.doc')
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files[4].fileType).toEqual('land-boundary')
    expect(app.landownerGainSiteRegistration.files[4].fileSize).toEqual('0.01')
    expect(app.landownerGainSiteRegistration.files[4].fileName).toEqual('legal-agreement.doc')
  })
  it('Should correctly handle getLegalAgreementFiles when there are no legal agreement files', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
    ])
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files.filter(file => file.fileType === 'legal-agreement')).toEqual([])
  })
  it('Should correctly handle getHectares when geospatial data is not uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'otherType')
    session.set(constants.redisKeys.LAND_BOUNDARY_HECTARES, 3)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(3)
  })
  it('Should correctly handle getHectares when geospatial data is uploaded', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, 'geospatialData')
    session.set(constants.redisKeys.GEOSPATIAL_HECTARES, 5)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.landBoundaryHectares).toEqual(5)
  })

  it('Should correctly handle getLandOwnershipFiles when there are no land ownerships', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, [
    ])
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files.filter(file => file.fileType === 'land-ownership')).toEqual([])
  })
  it('Should set the land ownership files', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, [
      {
        contentMediaType: 'application/pdf',
        fileLocation: '627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile2.pdf',
        fileName: 'lopfile2.pdf',
        fileSize: 13264,
        fileType: 'land-ownership',
        optional: false
      },
      {
        contentMediaType: 'application/pdf',
        fileLocation: '627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile1.pdf',
        fileName: 'lopfile1.pdf',
        fileSize: 13264,
        fileType: 'land-ownership',
        optional: false
      }
    ])
    const app = application(session, applicant)
    const lopFiles = app.landownerGainSiteRegistration.files.filter(
      (file) => file.fileType === 'land-ownership'
    )
    expect(lopFiles.length).toEqual(2)
    expect(lopFiles[0].fileName).toEqual('lopfile2.pdf')
  })

  it('Should correctly handle ownership proofs when land ownership files', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, [
    ])
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files.filter(file => file.fileType === 'land-ownership')).toEqual([
      {
        contentMediaType: 'application/pdf',
        fileLocation: '627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile2.pdf',
        fileName: 'lopfile2.pdf',
        fileSize: 13264,
        fileType: 'land-ownership',
        optional: false
      },
      {
        contentMediaType: 'application/pdf',
        fileLocation: '627560b8-cf81-4291-b640-2a2f91bd588b/land-ownership/lopfile1.pdf',
        fileName: 'lopfile1.pdf',
        fileSize: 13264,
        fileType: 'land-ownership',
        optional: false
      }])
  })
  it('Should correctly handle an application by an agent representing an individual with a UK address', () => {
    const session = applicationSession()
    const clientNameIndividual = {
      type: 'individual',
      value: {
        firstName: 'Mock',
        middleNames: '',
        lastName: 'Client'
      }
    }
    const clientType = constants.landownerTypes.INDIVIDUAL
    const clientEmail = 'someone@test.com'
    const clientPhoneNumber = '0123456789'
    const clientAddress = {
      addressLine1: 'Mock Street',
      town: 'Mock Town',
      postcode: 'AB1 2CD'
    }

    const expectedClientName = {
      firstName: clientNameIndividual.value.firstName,
      lastName: clientNameIndividual.value.lastName
    }

    const expectedClientAddress = Object.assign({
      line1: clientAddress.addressLine1,
      type: constants.ADDRESS_TYPES.UK
    }, clientAddress)

    delete expectedClientAddress.addressLine1

    session.set(constants.redisKeys.IS_AGENT, constants.APPLICANT_IS_AGENT.YES)
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, clientType)
    session.set(constants.redisKeys.CLIENTS_NAME_KEY, clientNameIndividual)
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.YES)
    session.set(constants.redisKeys.UK_ADDRESS_KEY, clientAddress)
    session.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY, clientEmail)
    session.set(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY, clientPhoneNumber)

    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.applicant.role).toEqual(constants.applicantTypes.AGENT)
    expect(app.landownerGainSiteRegistration.agent).toStrictEqual({
      clientType,
      clientNameIndividual: expectedClientName,
      clientEmail,
      clientPhoneNumber,
      clientAddress: expectedClientAddress
    })
  })
  it('Should correctly handle an application by an agent representing an organisation with a UK address', () => {
    const session = applicationSession()
    const clientNameOrganisation = 'Mock Organisation'
    const clientType = constants.landownerTypes.ORGANISATION
    const clientAddress = {
      addressLine1: 'Mock Building',
      addressLine2: 'Mock Steet',
      addressLine3: 'Mock District',
      town: 'Mock Town',
      county: 'Mock County',
      postcode: 'AB1 2CD'
    }

    const expectedClientAddress = Object.assign({
      line1: clientAddress.addressLine1,
      line2: clientAddress.addressLine2,
      line3: clientAddress.addressLine3,
      type: constants.ADDRESS_TYPES.UK
    }, clientAddress)

    delete expectedClientAddress.addressLine1
    delete expectedClientAddress.addressLine2
    delete expectedClientAddress.addressLine3

    session.set(constants.redisKeys.IS_AGENT, constants.APPLICANT_IS_AGENT.YES)
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, clientType)
    session.set(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY, clientNameOrganisation)
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.YES)
    session.set(constants.redisKeys.UK_ADDRESS_KEY, clientAddress)

    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.applicant.role).toEqual(constants.applicantTypes.AGENT)
    expect(app.landownerGainSiteRegistration.agent).toStrictEqual({
      clientType,
      clientNameOrganisation,
      clientAddress: expectedClientAddress
    })
  })
  it('Should correctly handle an application by an agent representing an individual with a non-UK address', () => {
    const session = applicationSession()
    const clientNameIndividual = {
      type: 'individual',
      value: {
        firstName: 'Mock',
        middleNames: '',
        lastName: 'Client'
      }
    }
    const clientType = constants.landownerTypes.INDIVIDUAL
    const clientEmail = 'someone@test.com'
    const clientPhoneNumber = '0123456789'
    const clientAddress = {
      addressLine1: 'Mock Street',
      town: 'Mock Town',
      country: 'Mock Country'
    }

    const expectedClientName = {
      firstName: clientNameIndividual.value.firstName,
      lastName: clientNameIndividual.value.lastName
    }

    const expectedClientAddress = Object.assign({
      line1: clientAddress.addressLine1,
      type: constants.ADDRESS_TYPES.INTERNATIONAL
    }, clientAddress)

    delete expectedClientAddress.addressLine1

    session.set(constants.redisKeys.IS_AGENT, constants.APPLICANT_IS_AGENT.YES)
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, clientType)
    session.set(constants.redisKeys.CLIENTS_NAME_KEY, clientNameIndividual)
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.NO)
    session.set(constants.redisKeys.NON_UK_ADDRESS_KEY, clientAddress)
    session.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY, clientEmail)
    session.set(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY, clientPhoneNumber)

    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.applicant.role).toEqual(constants.applicantTypes.AGENT)
    expect(app.landownerGainSiteRegistration.agent).toStrictEqual({
      clientType,
      clientNameIndividual: expectedClientName,
      clientEmail,
      clientPhoneNumber,
      clientAddress: expectedClientAddress
    })
  })
  it('Should correctly handle an application by an agent representing an organisation with a non-UK address', () => {
    const session = applicationSession()
    const clientNameIndividual = {
      type: 'individual',
      value: {
        firstName: 'Mock',
        middleNames: '',
        lastName: 'Client'
      }
    }
    const clientType = constants.landownerTypes.INDIVIDUAL
    const clientEmail = 'someone@test.com'
    const clientPhoneNumber = '0123456789'
    const clientAddress = {
      addressLine1: 'Mock Building',
      addressLine2: 'Mock Steet',
      addressLine3: 'Mock District',
      town: 'Mock Town',
      postcode: 'AB1 2CD'
    }

    const expectedClientName = {
      firstName: clientNameIndividual.value.firstName,
      lastName: clientNameIndividual.value.lastName
    }

    const expectedClientAddress = Object.assign({
      line1: clientAddress.addressLine1,
      line2: clientAddress.addressLine2,
      line3: clientAddress.addressLine3,
      type: constants.ADDRESS_TYPES.INTERNATIONAL
    }, clientAddress)

    delete expectedClientAddress.addressLine1
    delete expectedClientAddress.addressLine2
    delete expectedClientAddress.addressLine3

    session.set(constants.redisKeys.IS_AGENT, constants.APPLICANT_IS_AGENT.YES)
    session.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, clientType)
    session.set(constants.redisKeys.CLIENTS_NAME_KEY, clientNameIndividual)
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.NO)
    session.set(constants.redisKeys.NON_UK_ADDRESS_KEY, clientAddress)
    session.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY, clientEmail)
    session.set(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY, clientPhoneNumber)

    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.applicant.role).toEqual(constants.applicantTypes.AGENT)
    expect(app.landownerGainSiteRegistration.agent).toStrictEqual({
      clientType,
      clientNameIndividual: expectedClientName,
      clientEmail,
      clientPhoneNumber,
      clientAddress: expectedClientAddress
    })
  })
  it('Should correctly handle an application by an individual representing themselves', () => {
    const session = applicationSession()
    const address = {
      addressLine1: 'Mock Street',
      town: 'Mock Town',
      postcode: 'AB1 2CD'
    }

    const expectedAddress = Object.assign({
      line1: address.addressLine1,
      type: constants.ADDRESS_TYPES.UK
    }, address)

    delete expectedAddress.addressLine1

    session.set(constants.redisKeys.IS_AGENT, constants.APPLICANT_IS_AGENT.NO)
    session.set(constants.redisKeys.IN, constants.APPLICANT_IS_AGENT.NO)
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.YES)
    session.set(constants.redisKeys.UK_ADDRESS_KEY, address)

    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.applicant.role).toEqual(constants.applicantTypes.LANDOWNER)
    expect(app.landownerGainSiteRegistration.landownerAddress).toStrictEqual(expectedAddress)
  })
  it('Should correctly handle an application by a representative for an organisation', () => {
    const session = applicationSession()
    const organisationId = 'Mock organisation ID'
    const address = {
      addressLine1: 'Mock Street',
      town: 'Mock Town',
      postcode: 'AB1 2CD'
    }

    const expectedAddress = Object.assign({
      line1: address.addressLine1,
      type: constants.ADDRESS_TYPES.UK
    }, address)

    delete expectedAddress.addressLine1

    session.set(constants.redisKeys.IS_AGENT, constants.APPLICANT_IS_AGENT.NO)
    session.set(constants.redisKeys.ORGANISATION_ID, organisationId)
    session.set(constants.redisKeys.IS_ADDRESS_UK_KEY, constants.ADDRESS_IS_UK.YES)
    session.set(constants.redisKeys.UK_ADDRESS_KEY, address)

    const app = application(session, applicant)

    expect(app.landownerGainSiteRegistration.applicant.role).toEqual(constants.applicantTypes.REPRESENTATIVE)
    expect(app.landownerGainSiteRegistration.organisation).toStrictEqual({
      id: organisationId,
      address: expectedAddress
    })
  })
  it('Should set written authorisation file if is-agent', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.IS_AGENT, 'yes')
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files[8].fileType).toEqual('written-authorisation')
    expect(app.landownerGainSiteRegistration.files[8].optional).toEqual(false)
  })
  it('Should delete written authorisation file if not is-agent and file is blank', () => {
    const session = applicationSession()
    session.set(constants.redisKeys.IS_AGENT, 'no')
    session.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, null)
    session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, null)
    session.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, null)
    const app = application(session, applicant)
    expect(app.landownerGainSiteRegistration.files.length).toEqual(8)
  })
})
