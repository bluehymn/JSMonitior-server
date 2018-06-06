import {Service} from 'egg'
import {ObjectID} from 'mongodb'
import {DB} from '../db'

export default class Project extends Service {
  query (uid: ObjectID): Promise<any[]> {
    const projects = DB.collection('project')
    return projects.find({
      uid
    }).toArray() // return a promise
  }

  create (projectItem) {
    return new Promise(async (resolve, reject) => {
      const projects = DB.collection('project')
      const existed = await projects.findOne({
        uid: projectItem.uid,
        name: projectItem.name
      })
      if (existed) {
        reject({
          status: 409
        })
      } else {
        projects.insertOne({
          uid: projectItem.uid,
          name: projectItem.name
        }).then((result) => {
          resolve(result.ops[0])
        }, (error) => {
          reject(error)
        })
      }
    })
  }

  delete_ (project) {
    return new Promise((resolve, reject) => {
      const projects = DB.collection('project')
      projects.deleteOne({
        _id: new ObjectID(project.id),
        uid: project.uid
      }).then((data) => {
        resolve(data)
      }, (error) => {
        reject(error)
      })
    })
  }
}
