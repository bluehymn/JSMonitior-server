import {MongoClient, Db} from 'mongodb'

export let DB: Db

export function connectDB (config) {
  return new Promise((resolve, reject) => {
    const url = `mongodb://${config.user}:${encodeURIComponent(config.pwd)}@${config.host}:${config.port}/${config.db}`;
    MongoClient.connect(url, (err, client) => {
      if (err !== null) {
        reject(err)
        return
      } else {
        console.log('Connected to DB successful')
        DB = client.db(config.db)
        resolve(DB)
      }
    })
  })
}
