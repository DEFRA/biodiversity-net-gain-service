import { submitGetRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.CHECK_RESPONSIBLE_BODIES

describe(url, () => {
  let viewResult
  let h
  let redisMap
  let resultContext
  let responsibleBodiesList

  beforeEach(() => {
    h = {
      view: (view, context) => {
        viewResult = view
        resultContext = context
      },
      redirect: (view, context) => {
        viewResult = view
      }
    }

    redisMap = new Map()
    redisMap.set(constants.redisKeys.APPLICATION_TYPE, constants.applicationTypes.REGISTRATION)
    redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [{
      responsibleBodyName: 'test1'
    },
    {
      responsibleBodyName: 'test2'
    }])
    responsibleBodiesList = require('../../land/check-responsible-bodies.js')
  })

  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it('should show all responsible bodies that are added', async () => {
      const request = {
        yar: redisMap
      }

      await responsibleBodiesList.default[0].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_RESPONSIBLE_BODIES)
      expect(resultContext.legalAgreementResponsibleBodies.length).toEqual(2)
    })
    it('Should continue journey to NEED_ADD_ALL_RESPONSIBLE_BODIES if all responsible bodies removed', async () => {
      redisMap.set(constants.redisKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES, [])
      const request = {
        yar: redisMap,
        query: { id: '0' }
      }
      await responsibleBodiesList.default[0].handler(request, h)
      expect(viewResult).toEqual(constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES)
    })
  })

  describe('POST', () => {
    it('Should continue journey to NEED_ADD_ALL_LANDOWNERS if yes is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherResponsibleBody: 'yes' },
        path: responsibleBodiesList.default[1].path
      }

      await responsibleBodiesList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ANY_OTHER_LANDOWNERS)
    })

    it('Should continue journey to ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT if no is chosen', async () => {
      const request = {
        yar: redisMap,
        payload: { addAnotherResponsibleBody: 'no' },
        path: responsibleBodiesList.default[1].path
      }

      await responsibleBodiesList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)
    })

    it('Should fail journey if no answer', async () => {
      const request = {
        yar: redisMap,
        payload: {},
        path: responsibleBodiesList.default[1].path
      }

      await responsibleBodiesList.default[1].handler(request, h)

      expect(viewResult).toEqual(constants.views.CHECK_RESPONSIBLE_BODIES)
      expect(resultContext.err[0]).toEqual({ text: 'Select yes if you have added all responsible bodies', href: '#addAnotherResponsibleBody' })
    })
  })
})
