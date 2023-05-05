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

const updateAttr = ($item) => {
  const index = getItem().length
  const $label = $item.find('label:contains("Email address")')
  const $input = $label.siblings('input')
  const id = `emailAddresses[${index}]`
  $label.attr('for', id)
  $input.attr('id', id)
  $input.attr('name', id)
}

const cloneNewItem = (e) => {
  const $item = $container.find('.moj-add-another__item').last()
  updateAttr($item)
  removeError($item)
}

$container.on('click', '.moj-add-another__add-button', cloneNewItem)
$container.on('click', '.custom-remove-btn', handleRemoveBtn)
