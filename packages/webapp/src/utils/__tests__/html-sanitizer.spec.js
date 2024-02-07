import { htmlSanitizer, isXSSVulnerable } from '../html-sanitizer.js'

describe('HTML Sanitizer', () => {
  const xssVulnerableString = '<a onmouseover=`alert(document.cookie)`>resillion.doc'

  it('Should sanitize html from string to prevent XSS vulnerability', () => {
    const clean = htmlSanitizer(xssVulnerableString)
    expect(clean).toEqual('resillion.doc')
  })

  it('Should return true when XSS vulnerability is found', () => {
    const xssVelnerable = isXSSVulnerable(xssVulnerableString)
    expect(xssVelnerable).toBeTruthy()
  })
})
