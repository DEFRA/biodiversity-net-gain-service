const acceptButton = document.querySelector('.js-cookies-button-accept')
const rejectButton = document.querySelector('.js-cookies-button-reject')
const acceptedBanner = document.querySelector('.js-cookies-accepted')
const rejectedBanner = document.querySelector('.js-cookies-rejected')
const questionBanner = document.querySelector('.js-question-banner')
const cookieBanner = document.querySelector('.js-cookies-banner')
const cookieContainer = document.querySelector('.js-cookies-container')
const cookiePrefsPage = document.querySelector('.defra-js')
const cookieSeenBanner = 'seen_cookie_message'
const cookieSeenBannerExpiry = 30
const cookieUserPreference = 'set_cookie_usage'
const cookieUserPreferenceExpiry = 30
const cookieIsSecure = false

const getCookie = name => {
  const match = document.cookie.match(RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? match[1] : null
}

const setCookie = (cookieName, cookieValue, cookieExpiryDays = 365) => {
  const date = new Date()
  date.setTime(date.getTime() + (cookieExpiryDays * 24 * 60 * 60 * 1000))
  const expires = 'expires=' + date.toUTCString()
  let cookieRaw = `${cookieName}=${encodeURIComponent(cookieValue)};${expires};path=/`
  if (cookieIsSecure) {
    cookieRaw = `${cookieRaw};secure`
  }
  document.cookie = cookieRaw
}

const savePreference = accepted => {
  const prefs = {
    analytics: accepted ? 'on' : 'off'
  }
  setCookie(cookieUserPreference, JSON.stringify(prefs), cookieUserPreferenceExpiry)
}

if (cookiePrefsPage) {
  const saveButton = document.querySelector('#cookies-save')
  saveButton?.addEventListener('click', function (event) {
    event.preventDefault()
    const analyticsPreference = document.querySelector('input[name="accept-analytics"]:checked')
    savePreference(analyticsPreference.value === 'Yes')
  })
}

if (cookieContainer) {
  const showCookieBanner = getCookie(cookieSeenBanner)
  if (!showCookieBanner) {
    cookieContainer.style.display = 'block'
  } else {
    cookieContainer.style.display = 'none'
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
    showBanner(acceptedBanner)
    event.preventDefault()
    savePreference(true)
  })

  rejectButton?.addEventListener('click', function (event) {
    showBanner(rejectedBanner)
    event.preventDefault()
    savePreference(false)
  })

  acceptedBanner?.querySelector('.js-hide').addEventListener('click', function () {
    cookieBanner.setAttribute('hidden', 'hidden')
    setCookie(cookieSeenBanner, 'true', cookieSeenBannerExpiry)
  })

  rejectedBanner?.querySelector('.js-hide').addEventListener('click', function () {
    cookieBanner.setAttribute('hidden', 'hidden')
    setCookie(cookieSeenBanner, 'true', cookieSeenBannerExpiry)
  })
}
