// import Joi from '@hapi/joi'
// const envs = ['dev', 'test', 'prod']

// // Define config schema
// const schema = Joi.object().keys({
//   port: Joi.number().default(3000),
//   env: Joi.string().valid(...envs).default(envs[0])
// })

// // Build config
// const config = {
//   port: process.env.PORT,
//   env: process.env.NODE_ENV
// }

// // Validate config
// const { error, value } = schema.validate(config)

// // Throw if config is invalid
// if (error) {
//   throw new Error(`The server config is invalid. ${error.message}`)
// }

// // Add some helper props
// value.isDev = value.env === 'dev'

// export default value
