import {Service} from 'egg'
import {ObjectID} from 'mongodb'
import {DB} from '../db'

/**
 * @param {String} pid - project id
 * @param {String} name - api name
 * @param {String} url - api url
 * @param {String} body - response body
 */

interface IApiService {
  query (pid: string, page: number, pagesize: number)
}

export default class ApiService extends Service implements IApiService {
  query (pid, page, pagesize) {
    return new Promise (async (resolve, reject) => {
      const apis = DB.collection('errors')
      const queryCursor = apis.find({
        pid: new ObjectID(pid)
      })
      const total = await queryCursor.count()
      queryCursor
        .sort({$natural: -1})
        .skip(page * pagesize)
        .limit(pagesize)
        .toArray((error, result) => {
          if (error != null) {
            reject(error)
          }
          const responseBody = {
            data: result,
            total
          }
          resolve(responseBody)
        })
    })
  }

  queryOne (id) {
    return new Promise (async (resolve, reject) => {
      const errors = DB.collection('errors')
      errors.findOne({
        _id: new ObjectID(id)
      })
        .then((result) => {
          const responseBody = {
            data: result
          }
          resolve(responseBody)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  create (errorItem) {
    return new Promise(async (resolve, reject) => {
      const errors = DB.collection('errors')
      const project = DB.collection('project')
      const {pid, url, message, file, line, col, detail, ua} = errorItem
      const projectNotExisted = await project.findOne({
        _id: new ObjectID(pid)
      })

      if (projectNotExisted === null) {
        reject({
          status: this.app.httpStatus.NOT_FOUND
        })
        return
      }

      errors.insertOne({
        pid: new ObjectID(pid),
        url,
        message,
        file,
        line,
        col,
        detail,
        ua,
        timestamp: new Date()
      }).then((result) => {
        resolve(result)
      }, (error) => {
        reject({
          status: this.app.httpStatus.INTERNAL_SERVER_ERROR,
          error
        })
      })

    })
  }
}
