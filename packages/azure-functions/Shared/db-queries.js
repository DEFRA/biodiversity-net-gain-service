const createApplicationReference = db => db.query('select bng.fn_create_application_reference();')

export {
  createApplicationReference
}
