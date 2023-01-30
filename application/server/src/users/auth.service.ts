import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { UsersService } from './users.service'
import { randomBytes, scrypt as _scrypt} from 'crypto'
import { promisify } from 'util'

const scrpyt = promisify(_scrypt) // _scrypt makes use of callback pattern for asynchronous implementation, wrap it so that it returns a Promise instead

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {

  }

  /**
   * This method creates a user in the database if the provided email is not taken yet.
   * 
   * Encryption is using scrypt hasing function with a 8-byte randomly generated salt
   * 
   * @param email 
   * @param password 
   * @returns 
   */
  async register(email: string, password: string) {
    // see if email is in use
    const users = await this.usersService.find(email)
    if (users.length) {
      throw new BadRequestException('email is in use')
    }

    // Generate a salt
    const salt = randomBytes(8).toString('hex') // should be a 16-character string

    // Hash the users password
    const hash = ((await scrpyt(password, salt, 32)) as Buffer).toString('hex')
    const secret = salt + '.' + hash

    // Create a new user and save it
    const user = await this.usersService.create(email, secret) 

    // return the user
    return user
  }

  /**
   * The method is expected to be called when a user tries to
   * sign in.
   * 
   * @exception - If the user is not found, or 
   * @returns - the signed in user 
   */
  async authenticateUser(email: string, password: string) {
    const [user] = await this.usersService.find(email)
    if (!user) {
      throw new NotFoundException('user not found')
    }

    const [salt, storedHash] = user.password.split('.')

    const hash =  ((await scrpyt(password, salt, 32)) as Buffer).toString('hex')

    if (hash !== storedHash) {
      throw new BadRequestException('Wrong password')
    }

    // console.log("auth.service.ts(): Successfully signed in:", password)
    return user
  }
}