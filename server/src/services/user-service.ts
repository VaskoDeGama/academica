import { UserRepository } from '../repositories/user-repository'
import User from '../models/user'

export class UserService {
    private userRepository: UserRepository = new UserRepository()

    /**
     * Create user
     */
    async createUser (item: User) {
      return this.userRepository.create(item)
    }
}
