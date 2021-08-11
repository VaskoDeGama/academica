import { Read } from '../interfaces/read'
import { Write } from '../interfaces/write'
import { Collection } from 'mongodb'
import { DbConnect } from '../../utils/db-connect'

export abstract class BaseRepository<T> implements Write<T>, Read<T> {
  private readonly _db : DbConnect = new DbConnect()
  private _collection: Collection
  abstract collectionName: string

  /**
   * get and store collection
   * @param {string} name
   */
  async collection (name?: string) : Promise<Collection> {
    if (!this._collection) {
      const db = await this._db.db()
      this._collection = db.collection(name || this.collectionName)
    }

    return this._collection
  }

  /**
   * Get document count from collection
   */
  async countDocuments (): Promise<number> {
    const collection = await this.collection()
    return collection.countDocuments()
  }

  async create (item: T): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async find (item?: T): Promise<T[]> {
    throw new Error('Method not implemented.')
  }

  delete (id: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  findOne (id: string): Promise<T> {
    throw new Error('Method not implemented.')
  }

  update (id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
