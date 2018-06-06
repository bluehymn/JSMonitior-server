import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export type DefaultConfig = PowerPartial<EggAppConfig & IBizConfig>

export interface IBizConfig {
  DB: any
  DB1: any
  jwtSecret: string
  middleware: string[]
  authValidation: any
}

export default (appInfo: EggAppInfo) => {

  const config = {} as PowerPartial<EggAppConfig> & IBizConfig

  config.keys = appInfo.name + '_1518405921862_5478'

  config.DB = {
    db: 'jsmonitor',
    host: '192.168.10.254',
    port: '27017',
    user: 'user',
    pwd: '123456'
  }

  config.DB1 = {
    db: 'jsmonitor',
    host: '192.168.0.108',
    port: '27017',
    user: 'user1',
    pwd: '123456'
  }

  config.jwtSecret = '7cee4433361e1f8df3b1ebaa578841a470bc'

  config.middleware = ['authValidation']

  config.authValidation = {
    match (ctx) {
      const authRoutesWhiteList = ['/login', '/user', /\/project\/[^/]+\/error/]
      const path = ctx.path
      return authRoutesWhiteList.find((element) => {
        if (element instanceof RegExp) {
          return element.test(path)
        }
        return element === ctx.path
      }) === undefined ? true : false
    }
  }

  config.security = {
    csrf: {
      ignore: (ctx) => {
        return /\/project\/[^/]+\/error/.test(ctx.path)
      }
    }
  } as EggAppConfig['security']

  return config
}
