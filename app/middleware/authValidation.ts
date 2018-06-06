import {ITokenPayload, verifyToken} from '../controller/verifyToken'

export = () => {
  return async (ctx, next) => {
    try {
      const tokenPayload: ITokenPayload = await verifyToken(ctx)
      ctx.tokenPayload = tokenPayload
      await next()
    } catch (error) {
      ctx.status = error.status
      ctx.body = {
        msg: error.msg
      }
    }
  }
}
