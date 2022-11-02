/* global $ */
'use strict'
// purpose is to prefill the moj component if we get the page with
// landowners already populated or if there is an error.
const landowners = JSON.parse(window.bng.landowners)
const $container = $('#moj-add-another')
const removeButton = '<button type="button" class="govuk-button govuk-button--secondary moj-add-another__remove-button">Remove</button>'
const $item = $container.find('.moj-add-another__item').first().clone()
const $errItem = $item.clone()
$errItem.find('.govuk-form-group').addClass('govuk-form-group--error')
$errItem.find('label').after('<p id="landowners-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Enter the full name of the landowner</p>')
$errItem.find('input').addClass('govuk-input--error')

const removeNameAndErr = (e) => {
  const $item = $container.find('.moj-add-another__item').last()
  $item.find('input:text').val('')
  // if an error item
  if ($item.find('.govuk-form-group--error')) {
    $item.find('.govuk-form-group').removeClass('govuk-form-group--error')
    $item.find('p').remove()
    $item.find('input').removeClass('govuk-input--error')
  }
}

// On entry to the page if we have landowners we need to re-apply the repeating text boxes with values and errors
if (landowners) {
  landowners.forEach((element, i) => {
    // If less than 2 characters it is in error
    const thisItem = element.length < 2 ? $errItem.clone() : $item.clone()
    thisItem.find('input').attr('id', `landowners-${i}`)
    thisItem.find('input:text').val(element)
    // add a remove button
    if (!thisItem.find('.moj-add-another__remove-button').length && landowners.length !== 1) {
      thisItem.append(removeButton)
    }
    // add item before last
    $container.find('.moj-add-another__item').last().before(thisItem)
  })
  // if we have landowners pre set then remove last item that was added to page by default
  if (landowners.length > 0) {
    $container.find('.moj-add-another__item').last().remove()
  }
}

$container.on('click', '.moj-add-another__add-button', removeNameAndErr)
