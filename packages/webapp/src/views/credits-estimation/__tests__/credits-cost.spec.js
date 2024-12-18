import nunjucks from 'nunjucks'
import path from 'path'
import creditsEstimationConstants from '../../../utils/credits-estimation-constants.js'
const templatesDir = path.resolve(__dirname, './../../')
const govukDir = path.resolve(__dirname, './../../../../node_modules/govuk-frontend/dist')

const nunjucksEnv = new nunjucks.Environment(new nunjucks.FileSystemLoader([
  templatesDir,
  govukDir
]))
const templatePath = path.resolve(templatesDir, 'credits-estimation/credits-cost.html')
const url = creditsEstimationConstants.routes.ESTIMATOR_CREDITS_TIER

const serviceName = 'SERVICE_NAME'

describe('credits cost view', () => {
  it('should render service url with credits tier href', () => {
    const renderedOutput = nunjucksEnv.render(templatePath, { serviceName })
    const hrefRegex = /<a[^>]*href="(\/credits-estimation\/credits-tier)"[^>]*>(.*?)<\/a>/i
    const match = renderedOutput.replace(/\s{2,}/g, ' ').match(hrefRegex)
    expect(match).toBeTruthy()
    const hrefAttributeValue = match[1]
    const textContent = match[2]
    expect(hrefAttributeValue).toBe(url)
    expect(textContent.trim()).toBe(serviceName)
  })
})
