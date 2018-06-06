import {createHash, Hash} from 'crypto'
import {Controller} from 'egg'
import * as jwt from 'jsonwebtoken'
import createSalt from '../utilities/createSalt'

import {IUser} from '../service/user'

export default class UserController extends Controller {
  async create () {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    const reqBody: any = ctx.request.body
    const username: string = reqBody.username
    const password: string = reqBody.password
    const salt: string = createSalt()
    let pwdHash: string = null
    const hash: Hash = createHash('sha512')

    // 保存user pwdHash 和 salt 
    pwdHash = hash.update(password + salt).digest('hex')

    try {
      const ret = await service.user.create(username, pwdHash)
      const uid = ret._id
      try {
        await service.user.storeSalt(uid, salt)
        ctx.status = app.httpStatus.OK
        ctx.body = {
          msg: '注册成功'
        }
      } catch (error) {
        ctx.status = app.httpStatus.INTERNAL_SERVER_ERROR
        ctx.body = 'Internal Server Error'
      }
    } catch (error) {
      switch (error.status) {
        case app.httpStatus.CONFLICT:
          ctx.status = app.httpStatus.CONFLICT
          ctx.body = {
            msg: `用户名${username}已存在`
          }
          break
        default:
          ctx.status = app.httpStatus.INTERNAL_SERVER_ERROR
          ctx.body = 'Internal Server Error'
      }
    }
  }

  async login () {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    const reqBody: any = ctx.request.body
    const username: string = reqBody.username
    const password: string = reqBody.password
    let user: IUser
    
    try {
      user = await service.user.query(username)
    } catch (error) {
      if (error.status === app.httpStatus.NOT_FOUND) {
        ctx.status = app.httpStatus.NOT_FOUND
        ctx.body = {
          msg: '用户不存在'
        }
      }
    }

    if (user) {
      const uid = user._id
      const pwdHashInput = user.password
      try {
        const salt = await service.user.querySalt(uid)
        const hash = createHash('sha512')
        const pwdHashStored = hash.update(password + salt).digest('hex')
        const uidHex = uid.toHexString()
        if (pwdHashInput === pwdHashStored) {
          ctx.status = app.httpStatus.OK
          // 刷新 CSRF token
          // ctx.rotateCsrfSecret()
          ctx.body = {
            msg: '登录成功',
            token: this.createToken(uidHex)
          }
        } else {
          ctx.status = app.httpStatus.UNAUTHORIZED
          ctx.body = {
            msg: '密码错误'
          }
        }
      } catch (error) {
        ctx.status = app.httpStatus.NOT_FOUND
        ctx.body = {
          msg: '用户不存在'
        }
      }

    }
  }

  createToken (uid: string): string {
    const token = jwt.sign(
      { uid },
      this.app.config.jwtSecret,
      {expiresIn: '1h'}
    )
    return token
  }

  nopermission (data) {
    const ctx = this.ctx
    ctx.status = data.code
    ctx.body = {
      msg: data.msg
    }
  }
}
