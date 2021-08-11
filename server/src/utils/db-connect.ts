import { MongoClient, Db } from 'mongodb'
import config from 'config'

export class DbConnect {
    private _db: Db
    private client: MongoClient
    private url: string = config.get('DataBase.url')

    async db () {
      if (!this._db) {
        this.client = await MongoClient.connect(this.url)
        this._db = this.client.db('test')
      }
      return this._db
    }
}
