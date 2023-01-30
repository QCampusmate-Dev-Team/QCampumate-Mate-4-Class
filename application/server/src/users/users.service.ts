import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
  }

  /**
   * @param email 
   * @param password 
   * @returns { Promise<User> }
   */
  // create and save a user to database
  create(email: string, password: string) {
    const user = this.repo.create({ email, password })

    return this.repo.save({ email, password })
  }

  /** 
   * find a user by id.
   * If id is null, return a null immediately
   * 
   * Otherwise, try find a user in the database.
   * If no user is found, raise a 404 error and exit,
   * otherwise, return the found user
   * 
   */
  async findOne(id: number): Promise<User> | null {
    if (!id) { // if null 
      return null
    }

    const user = await this.repo.findOneBy({id})
    return user
  }

  /**
   * find users by email
   * 
   * @returns - all users matched with the email
   */ 
  find(email: string): Promise<User[]> | null {
    return this.repo.findBy({ email: email })
  }

  // update 
  async update(id: number, updatedUser:Partial<User>) {
    const user = await this.repo.findOneBy({id})
    if (!user) {
      throw new NotFoundException(`Failed to update user! User with id '${id}' does not exist`)
    }
    Object.assign(user, updatedUser)

    return this.repo.save(user)
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({id})
    if (!user) {
      throw new NotFoundException(`Failed to remove user! User with id '${id}' does not exist`)
    }
    return this.repo.remove(user)
  }
}
