import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { User } from './user.entity'
import { ElasticSearchService } from '../elastic-search/elastic-search.service'
import { UserFindOptions } from './user.types'

@Injectable()
export class UserService implements OnApplicationBootstrap  {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly elasticService: ElasticSearchService,
  ) {}

  onApplicationBootstrap() {
    return this.userRepository.createTable()
  }

  async save(user: User): Promise<User> {
    const userCreated = await this.userRepository.insert(user)

    this.elasticService.index('user', {
      id: userCreated.id,
      email: userCreated.email,
      firstName: userCreated.firstName,
      lastName: userCreated.lastName,
    })

    return userCreated
  }

  find(options: UserFindOptions): Promise<User> {
    return this.userRepository.findOne(options)
  }

  async verifyEmail(user: User): Promise<boolean> {
    const userVerified = await this.userRepository.verify(user.id)
    return userVerified.isEmailValid
  }

  increaseAttempts(user: User): Promise<User> {
    return this.userRepository.updateAttempts(user.id, user.attempts + 1)
  }

  resetAttempts(user: User): Promise<User> {
    return this.userRepository.updateAttempts(user.id, 0)
  }
}
