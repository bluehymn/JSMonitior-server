import {IHttpStatus} from '../../../app/extend/application'

declare module 'egg' {
  interface Application {
    httpStatus: IHttpStatus
  }
}