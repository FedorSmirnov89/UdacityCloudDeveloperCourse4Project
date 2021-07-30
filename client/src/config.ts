// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '4u5j9pgkzk'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-jx-i6s40.eu.auth0.com',            // Auth0 domain
  clientId: 'Hq2cYmUv6EJG8NxY9zcgd8t6vdBwoy08',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
