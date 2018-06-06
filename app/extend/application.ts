
export interface IHttpStatus {
  OK: number
  CREATED: number
  ACCEPTED: number

  BAD_REQUEST: number
  UNAUTHORIZED: number
  FORBIDDEN: number
  NOT_FOUND: number
  CONFLICT: number
  INTERNAL_SERVER_ERROR: number
}


export const httpStatus: IHttpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  // 203 "non-authoritative information"
  // 204 "no content"
  // 205 "reset content"
  // 206 "partial content"
  // 207 "multi-status"
  // 208 "already reported"
  // 226 "im used"
  
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  // 402 "payment required"
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  // 405 "method not allowed"
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500 // Internal Server Error
}