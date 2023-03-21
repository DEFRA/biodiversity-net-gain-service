'use strict'
// "bng" represents the global namespace for client side js accross the service
window.bng = {}

// Hide defra-js-hide elements on page load
const nonJsElements = document.getElementsByClassName('defra-js-hide')
Array.prototype.forEach.call(nonJsElements, function (element) {
  element.style.display = 'none'
})

// Show defra-js-show elements on page load
// To use this set class to defra-js-show and give hidden attribute to hide by default
const jsElements = document.getElementsByClassName('defra-js-show')
Array.prototype.forEach.call(jsElements, function (element) {
  element.removeAttribute('hidden')
})
