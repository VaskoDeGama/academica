import { BaseRepository } from './base/base-repository'
import User from '../models/user'

export class UserRepository extends BaseRepository<User> {
  collectionName = 'users'

  async create (item: User): Promise<boolean> {
    console.log(item)
    return true
  }
}
