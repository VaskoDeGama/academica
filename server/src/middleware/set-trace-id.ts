import httpContext from 'express-http-context'
import { v4 as uuid } from 'uuid'

import { getLogger } from 'log4js'
const log = getLogger('Request')

export function setTraceId (request: any, response: any, next?: (err?: any) => any): any {
  const traceId = uuid()
  httpContext.set('reqStartTime', Date.now())
  httpContext.set('traceId', traceId)
  log.info(`#${traceId}: start request...`)
  next()
}
