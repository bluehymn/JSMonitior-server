import * as jwt from 'jsonwebtoken'
import {httpStatus} from '../extend/application'

export interface ITokenPayload {
  uid: string
}

export function verifyToken(ctx): Promise<ITokenPayload> {
  return new Promise ((resolve, reject) => {
    const token: string = ctx.headers['x-access-token']
    const jwtSecret: string = ctx.app.config.jwtSecret
    if (token) {
      jwt.verify(token, jwtSecret, async (error, decoded: ITokenPayload) => {
        if (error) {
          reject({
            status: httpStatus.UNAUTHORIZED,
            msg: 'token已过期'
          })
        } else {
          resolve(decoded)
        }
      })
    } else {
      ctx.status = httpStatus.UNAUTHORIZED
      reject({
        status: httpStatus.UNAUTHORIZED,
        msg: 'token丢失'
      })
    }
  })
}
