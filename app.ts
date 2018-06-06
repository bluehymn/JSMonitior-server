import { Application } from 'egg'
import {connectDB} from './app/db'

export default async (app: Application) => {
  await connectDB(app.config.DB1)
}
