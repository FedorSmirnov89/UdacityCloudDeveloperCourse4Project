import { decode } from 'jsonwebtoken'

import { APIGatewayProxyEvent } from 'aws-lambda'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

/**
 * Extracts the user ID from the gateway event
 * @param event the gateway event
 * @returns the user ID string
 */
export function getUserFromEvent(event: APIGatewayProxyEvent): string{
  const authHeader = event.headers['Authorization']
  const tokenString = getToken(authHeader)
  return parseUserId(tokenString)
}

/**
 * Parses the header to return the JWT string
 * @param authHeader the entire header
 * @returns the JWT string
 */
export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]
  return token
}


