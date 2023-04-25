'use strict'
// "bng" represents the global namespace for client side js accross the service
window.bng = {
  utils: {
    getCookie: (name) => {
      const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
      return v ? v[2] : null
    },
    setCookie: (cookieName, cookieValue, cookieExpiryDays = 365) => {
      const date = new Date()
      date.setTime(date.getTime() + (cookieExpiryDays * 24 * 60 * 60 * 1000))
      const expires = 'expires=' + date.toUTCString()
      const sameSite = 'SameSite=Strict'
      document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)};${sameSite};${expires};path=/`
    },
    deleteCookie: (cookieName) => {
      const expires = 'expires=Thu, 01 Jan 1970 00:00:01 GMT'
      const path = 'path=/'
      const hostname = window.location.hostname
      const dotHostname = `.${hostname}`
      const domain = `domain=${(hostname === 'localhost') ? 'localhost' : dotHostname}`
      document.cookie = `${cookieName}=;${expires};${domain};${path}`
    },
    deleteAnalyticsCookies: () => {
      const splitCookies = document.cookie.split(';')
      splitCookies.forEach((cookie) => {
        const nameAndValue = cookie.trim().split('=')
        if (nameAndValue && nameAndValue.length === 2 && nameAndValue[0].startsWith('_ga')) {
          window.bng.utils.deleteCookie(nameAndValue[0])
        }
      })
    },
    setupGoogleTagManager: () => {
      const gtmid = process.env.GOOGLE_TAGMANAGER_ID
      if (gtmid) {
        const script = document.createElement('script')
        script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmid}`
        script.onload = () => {
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          })
          window.bng.utils.fireGTagCookiePreferenceEvent()
        }
        document.body.appendChild(script)
      }
    },
    fireGTagCookiePreferenceEvent: () => {
      const userPreferenceCookie = window.bng.utils.getCookie(cookieUserPreference)
      if (userPreferenceCookie) {
        const cookiePreferences = JSON.parse(decodeURIComponent(userPreferenceCookie))
        if (cookiePreferences.analytics === 'on') {
          window.dataLayer.push({ event: 'Cookie Preferences', cookiePreferences })
        }
      }
    }
  }
}

let calledGTag = false

// Hide defra-js-hide elements on page load
const nonJsElements = document.getElementsByClassName('defra-js-hide')
Array.prototype.forEach.call(nonJsElements, function (element) {
  element.style.display = 'none'
})

// Show defra-js-show elements on page load
// To use this set class to defra-js-show and give hidden attribute or hidden class to hide by default
const jsElements = document.getElementsByClassName('defra-js-show')
Array.prototype.forEach.call(jsElements, function (element) {
  element.removeAttribute('hidden')
  // where an attribute is not possible (gds summaryList row) remove 1 hidden class
  // Note if 2 hidden classes are set then it will remain hidden
  element.className = element.className.replace('hidden', '')
})

const acceptButton = document.querySelector('.js-cookies-button-accept')
const rejectButton = document.querySelector('.js-cookies-button-reject')
const acceptedBanner = document.querySelector('.js-cookies-accepted')
const rejectedBanner = document.querySelector('.js-cookies-rejected')
const questionBanner = document.querySelector('.js-question-banner')
const cookieBanner = document.querySelector('.js-cookies-banner')
const cookiePrefsPage = document.querySelector('#cookie-page-buttons')
const cookiePageBanner = document.querySelector('.js-cookie-page-banner')
const cookieSeenBanner = 'seen_cookie_message'
const cookieSeenBannerExpiry = 30
const cookieUserPreference = 'set_cookie_usage'
const cookieUserPreferenceExpiry = 30

// If cookie banner is on page (i.e. not on cookie settings page)
const cookieBannerContainer = document.querySelector('.js-cookie-banner-container')
if (cookieBannerContainer) {
  const seenCookieMessage = window.bng.utils.getCookie(cookieSeenBanner)
  // Remove banner if seen and avoid flicker
  if (seenCookieMessage) {
    cookieBannerContainer.parentNode.removeChild(cookieBannerContainer)
  } else {
    cookieBannerContainer.style.display = 'block'
  }
}

const savePreference = accepted => {
  const prefs = {
    analytics: accepted ? 'on' : 'off'
  }
  window.bng.utils.setCookie(cookieUserPreference, JSON.stringify(prefs), cookieUserPreferenceExpiry)
}

if (cookiePrefsPage) {
  const userPreferenceCookie = window.bng.utils.getCookie(cookieUserPreference)
  if (userPreferenceCookie) {
    const cookiePreferences = JSON.parse(decodeURIComponent(userPreferenceCookie))
    if (cookiePreferences.analytics === 'on') {
      document.querySelector('#accept-analytics-yes').checked = true
    }
    if (cookiePreferences.analytics === 'off') {
      document.querySelector('#accept-analytics-no').checked = true
    }
  } else {
    document.querySelector('#accept-analytics-no').checked = true
  }
  const saveButton = document.querySelector('#cookies-save')
  saveButton?.addEventListener('click', function (event) {
    event.preventDefault()
    const analyticsPreference = document.querySelector('input[name="accept-analytics"]:checked')
    savePreference(analyticsPreference.value === 'Yes')
    if (analyticsPreference.value === 'Yes') {
      if (!calledGTag) {
        calledGTag = true
        window.bng.utils.setupGoogleTagManager()
      } else {
        window.bng.utils.fireGTagCookiePreferenceEvent()
      }
    } else {
      window.bng.utils.deleteAnalyticsCookies()
    }
    window.bng.utils.setCookie(cookieSeenBanner, 'true', cookieSeenBannerExpiry)
    cookiePageBanner.removeAttribute('hidden')
    cookiePageBanner.style.display = 'block'
    cookiePageBanner.setAttribute('tabindex', '-1')
    cookiePageBanner.focus()
  })
}

if (cookieBannerContainer) {
  const showCookieBanner = window.bng.utils.getCookie(cookieSeenBanner)
  if (!showCookieBanner) {
    cookieBannerContainer.style.display = 'block'
  } else {
    cookieBannerContainer.style.display = 'none'
  }

  const showBanner = banner => {
    questionBanner.setAttribute('hidden', 'hidden')
    banner.removeAttribute('hidden')
    // Shift focus to the banner
    banner.setAttribute('tabindex', '-1')
    banner.focus()

    banner.addEventListener('blur', function () {
      banner.removeAttribute('tabindex')
    })
  }

  acceptButton?.addEventListener('click', function (event) {
    event.preventDefault()
    savePreference(true)
    window.bng.utils.setCookie(cookieSeenBanner, 'true', cookieSeenBannerExpiry)
    calledGTag = true
    window.bng.utils.setupGoogleTagManager()
    showBanner(acceptedBanner)
  })

  rejectButton?.addEventListener('click', function (event) {
    event.preventDefault()
    savePreference(false)
    window.bng.utils.setCookie(cookieSeenBanner, 'true', cookieSeenBannerExpiry)
    window.bng.utils.deleteAnalyticsCookies()
    showBanner(rejectedBanner)
  })

  acceptedBanner?.querySelector('.js-hide').addEventListener('click', function () {
    cookieBanner.setAttribute('hidden', 'hidden')
  })

  rejectedBanner?.querySelector('.js-hide').addEventListener('click', function () {
    cookieBanner.setAttribute('hidden', 'hidden')
  })
}

if (!calledGTag) {
  // finally initialize GTM env if not already done (and cookie preferences allow)
  const userPreferenceCookie = window.bng.utils.getCookie(cookieUserPreference)
  if (userPreferenceCookie) {
    const cookiePreferences = JSON.parse(decodeURIComponent(userPreferenceCookie))
    if (cookiePreferences.analytics === 'on') {
      calledGTag = true
      window.bng.utils.setupGoogleTagManager()
    } else {
      // delete any orphaned analytics cookies
      window.bng.utils.deleteAnalyticsCookies()
    }
  }
}
