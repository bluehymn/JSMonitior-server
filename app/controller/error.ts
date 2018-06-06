import {Controller} from 'egg'

export default class ApiController extends Controller {

  async query() {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    try {
      const pid = ctx.params.pid
      const page = ctx.query.page ? Number(ctx.query.page) - 1 : 0
      const pagesize = ctx.query.pagesize ? Number(ctx.query.pagesize) : 20
      const res = await service.error.query(pid, page, pagesize)
      ctx.status = app.httpStatus.OK
      ctx.body = res
    } catch (error) {
      ctx.status = app.httpStatus.NOT_FOUND
      ctx.body = {
        msg: 'not found'
      }
    }
  }

  async queryOne() {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    const id = ctx.params.id
    try {
      const res = await service.error.queryOne(id)
      ctx.status = app.httpStatus.OK
      ctx.body = res
    } catch (error) {
      ctx.status = app.httpStatus.NOT_FOUND
      ctx.body = {
        msg: 'not found'
      }
    }
  }

  async create() {
    const ctx = this.ctx
    const app = this.app
    const service = this.service
    const reqBody = ctx.request.body

    const pid = ctx.params.pid
    const message = reqBody.message
    const url = reqBody.url
    const file = reqBody.file
    const line = reqBody.line
    const col = reqBody.col
    const detail = reqBody.detail

    const ua = JSON.stringify(ctx.headers)

    try {
      const result = await service.error.create({
        pid,
        url,
        file,
        line,
        col,
        message,
        detail,
        ua
      })
      ctx.status = app.httpStatus.CREATED
      ctx.body = {
        msg: 'success',
        data: result
      }
    } catch (error) {
      switch (error.status) {
        case app.httpStatus.CONFLICT: 
          ctx.status = app.httpStatus.CONFLICT
          ctx.body = {
            msg: 'URL: ' + url + ' 已存在'
          }
          break
        case app.httpStatus.NOT_FOUND:
          ctx.status = app.httpStatus.NOT_FOUND
          ctx.body = {
            msg: '项目不存在'
          }
          break
        default:
          ctx.status = app.httpStatus.NOT_FOUND
          ctx.body = {
            msg: '项目不存在'
          }
      }
    }
  }

}
