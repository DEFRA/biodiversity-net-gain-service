import DOMPurify from 'isomorphic-dompurify'

const htmlSanitizer = (stringToSanitize) => DOMPurify.sanitize(stringToSanitize, { USE_PROFILES: { html: false } })

const isXSSVulnerable = (stringToSanitize) => htmlSanitizer(stringToSanitize) !== stringToSanitize

export { htmlSanitizer, isXSSVulnerable }
