// TO DO - Replace anonymous access to this endpoint.
export default async function (context, req, connectionInfo) {
  context.res.body = connectionInfo
}
