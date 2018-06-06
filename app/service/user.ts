import {Service} from 'egg'
import { DB } from '../db'
import {ObjectID} from 'mongodb'

export interface ISalt {
  uid: ObjectID
  salt: string
}

export interface IUser {
  _id: ObjectID
  username: string
  password: string
}

export default class UserService extends Service {
  query (username: string): Promise<IUser> {
    const app = this.app
    return new Promise(async (resolve, reject) => {
      const users = DB.collection('user')
      try {
        const user = await users.findOne<IUser | null>({
          username
        })
        if (user !== null) {
          resolve(user)
        } else {
          reject({
            status: app.httpStatus.NOT_FOUND
          })
        }
      } catch (error) {
        reject({
          status: app.httpStatus.INTERNAL_SERVER_ERROR
        })
      }
    })
  }

  create (username: string, pwdHash: string): Promise<IUser> {
    const ctx = this.ctx
    const app = this.app
    return new Promise(async (resolve, reject) => {
      const users = DB.collection('user')
      const user = await users.findOne<IUser | null>({
        username
      })

      if (user !== null) {
        reject({
          status: app.httpStatus.CONFLICT
        })
      } else {
        users.insertOne({
          username,
          password: pwdHash
        }).then((result) => {
          resolve(result.ops[0])
        }, (error) => {
          reject({
            status: app.httpStatus.INTERNAL_SERVER_ERROR,
            msg: 'Internal Server Error'
          })
          ctx.logger.error(error)
        })
      }
    })
  }

  storeSalt (uid, salt): Promise<void> {
    const ctx = this.ctx
    const app = this.app
    return new Promise((resolve, reject) => {
      const salts = DB.collection('salt')
      salts.insertOne({
        uid,
        salt
      }).then(() => {
        resolve()
      }, (error) => {
        reject({
          status: app.httpStatus.INTERNAL_SERVER_ERROR,
          msg: 'Internal Server Error'
        })
        ctx.logger.error(error)
      })
    })
  }

  querySalt (uid): Promise<string> {
    const ctx = this.ctx
    const app = this.app
    return new Promise (async (resolve, reject) => {
      const salts = DB.collection('salt')
      try {
        const ret = await salts.findOne<ISalt | null>({
          uid
        })
        resolve(ret.salt)
      } catch (error) {
        reject({
          status: app.httpStatus.NOT_FOUND
        })
        ctx.logger.error(error)
      }
    })
  }
}
