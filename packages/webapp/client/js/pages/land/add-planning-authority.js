/* global $ */
import accessibleAutocomplete from 'accessible-autocomplete'
window.onload = function () {
  accessibleAutocomplete.enhanceSelectElement({
    selectElement: document.querySelector('#localPlanningAuthority'),
    name: 'localPlanningAuthority',
    classes: 'govuk-!-width-two-thirds',
    defaultValue: '',
    onConfirm: () => {
      const localPlanningAuthority = $('#localPlanningAuthority > option').filter(function () {
        return this.text === $('#localPlanningAuthority').val()
      }).val()
      $('#localPlanningAuthority').val(localPlanningAuthority)
    }
  })
}
