import { htmlSanitizer } from '../html-sanitizer.js'

describe('HTML Sanitizer', () => {
  it('Should sanitize html from string to prevent XSS vulnerability', () => {
    const clean = htmlSanitizer('<a onmouseover=`alert(document.cookie)`>resillion.doc')
    expect(clean).toEqual('resillion.doc')
  })
})
