/* global $ */
'use strict'

const $container = $('div[data-module="moj-add-another"]')

const getItem = () => $container.find('fieldset')

const handleRemoveBtn = e => {
  const $item = getItem()
  if ($item.length > 1) {
    $(this).closest('.govuk-fieldset').remove()
  } else {
    $(this).remove()
  }
}

// Update attr and remove errors while cloning new elements
const removeError = ($item) => {
  $item.find('input:text').val('')
  // if an error item
  if ($item.find('.govuk-form-group--error')) {
    $item.find('.govuk-form-group').removeClass('govuk-form-group--error')
    $item.find('p').remove()
    $item.find('input').removeClass('govuk-input--error')
  }
}

const updateElement = ($label, idPrefix, index) => {
  const $input = $label.siblings('input')
  const id = `${idPrefix}[${index}]`
  $label.attr('for', id)
  $input.attr('id', id)
}

const updateElements = ($item) => {
  const index = getItem().length
  const $emailLabel = $item.find('label:contains("Email address")')
  const $nameLabel = $item.find('label:contains("Full name")')
  updateElement($emailLabel, 'email-', index)
  updateElement($nameLabel, 'fullName-', index)
}

const cloneNewItem = (e) => {
  const $item = $container.find('.moj-add-another__item').last()
  updateElements($item)
  removeError($item)
}

$container.on('click', '.moj-add-another__add-button', cloneNewItem)
$container.on('click', '.custom-remove-btn', handleRemoveBtn)
