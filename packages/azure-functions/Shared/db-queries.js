const createApplicationReference = db => db.query('select bng_user.fn_create_application_reference();')

export {
  createApplicationReference
}
