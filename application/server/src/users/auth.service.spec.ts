import { Test } from '@nestjs/testing'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'


describe('AuthService', () => {
  let service: AuthService
  let userServiceMock: Partial<UsersService>
  beforeEach(async () => {
    const users: User[] = [] // fake user database

    // Create a mock of the UsersService    
    userServiceMock = {
      find: (email:string) => { 
        const filteredUsers = users.filter( user => user.email === email)
        // console.log(users)
        return Promise.resolve(filteredUsers) 
      },
      // the password should be hash
      create: (email: string, password: string) => {
        const mockUser = { id: Math.floor(Math.random() * 9999), email, password } as User
        users.push(mockUser)

        return Promise.resolve(mockUser)
      }
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // if any module resolves an dependency to <provide>, we give it a <userValue>
          provide: UsersService,  
          useValue: userServiceMock
        }
      ]
    }).compile()
  
    service = module.get(AuthService) // create a instance of AuthService with all of its dependencies initialized
  })
  
  
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.register('nilumbra@nilumbra.me', '123456')

    // only tests that user's password is hash to something other than provided plaintext
    expect(user.password).not.toEqual('123456')
    const [salt, hash] = user.password.split('.')

    // test stored password is of type in  .+\\..+
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if the user signs up with an email that is in use', async() => {
    // userServiceMock.find = async () => Promise.resolve([{ id: 1, email: 'notexit@nilumbra.me', password: "passwd"} as User])
    const mockEmail = "nilumbra@ucsd.edu"
    await service.register(mockEmail, "whatever")

    expect(
      service.register(mockEmail, "whatever")
    ).rejects.toThrow(BadRequestException)

  })

  it('throws an error if user signs in with an unregistered email', async() => {
    expect(
      service.authenticateUser('notexit@nilumbra.me', '123123')
    ).rejects.toThrow(NotFoundException)
  })

  it('throws if an invalid password is provided', async() => {
    // SETUP
    //  provide a predifind (email,passwd) pair
    const mockEmail = 'mock@mock.wtf'
    const mockPassword = 'glutenfree'

    await service.register(mockEmail, mockPassword)
  
    // compare the test case with the predefined passwd
    expect(
      service.authenticateUser(mockEmail, mockPassword + +'bad_extra_string')
    ).rejects.toThrow(BadRequestException)
  })

  it('returns a user for authentication if correct password is provided', async() => {
    // SETUP:
    //  sign up a user 
    const mockEmail = 'mock@mock.wtf'
    const mockPassword = 'glutenfree'
    await service.register(mockEmail, mockPassword)

    // TEST:
    expect(
      await service.authenticateUser(mockEmail, mockPassword)
    ).toBeDefined()
  })
})

