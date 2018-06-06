import {Controller} from 'egg'
import {ObjectID} from 'mongodb'

export default class ProjectController extends Controller {

  public async query () {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    const tokenPayload = ctx.tokenPayload
    const uid = tokenPayload !== undefined ? tokenPayload.uid : null
    try {
      const res: any[] = await service.project.query(new ObjectID(uid))
      ctx.status = app.httpStatus.OK
      ctx.body = res
    } catch (error) {
      ctx.status = app.httpStatus.NOT_FOUND
      ctx.body = {
        msg: 'not found'
      }
    }
  }

 /**
  * @param {String} name - projcet name
  * @param {String} uid - user ID
  */

  async create () {
    const ctx = this.ctx
    const app = this.app
    const service = this.service

    const name: string = ctx.request.body.name

    const tokenPayload = ctx.tokenPayload
    const uid = tokenPayload !== undefined ? tokenPayload.uid : null
    try {
      const ret = await service.project.create({
        uid: new ObjectID(uid),
        name
      })
      ctx.status = app.httpStatus.OK
      ctx.body = {
        msg: 'success',
        data: ret
      }
    } catch (error) {
      if (error.status === app.httpStatus.CONFLICT) {
        ctx.status = app.httpStatus.CONFLICT
        ctx.body = {
          msg: `项目${name}已存在`
        }
      }
    }
  }

  async delete_ () {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    const id: string = ctx.request.body.id
    const tokenPayload = ctx.tokenPayload
    const uid = tokenPayload !== undefined ? tokenPayload.uid : null
    try {
      await service.project.delete_({id, uid})
      ctx.status = app.httpStatus.OK
      ctx.body = {
        msg: 'success'
      }
    } catch (error) {
      ctx.status = app.httpStatus.INTERNAL_SERVER_ERROR
      ctx.body = {
        msg: 'Internal Server Error'
      }
    }
  }

}
