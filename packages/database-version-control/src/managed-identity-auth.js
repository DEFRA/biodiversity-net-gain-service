const { DefaultAzureCredential } = require('@azure/identity')

const getToken = async () => {
  const credential = new DefaultAzureCredential()
  const { token } = await credential.getToken('https://ossrdbms-aad.database.windows.net')
  return token
}

module.exports = {
  getToken
}
