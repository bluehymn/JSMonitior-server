
/**
 * @param {Egg.Application} app - egg application
 */

import { Application } from 'egg'

export default (app: Application) => {
  const { router, controller } = app
  // const middleware = app.middleware as any

  // 项目
  router.get('/project', controller.project.query)
  router.post('/project', controller.project.create)
  router.del('/project', controller.project.delete_)

  // 接口
  router.get('/project/:pid/errors', controller.error.query)
  router.post('/project/:pid/error', controller.error.create)
  router.get('/error/:id', controller.error.queryOne)

  // 用户
  router.post('/user', controller.user.create)
  router.put('/login', controller.user.login)
  router.get('/nopermission', controller.user.nopermission)

}
