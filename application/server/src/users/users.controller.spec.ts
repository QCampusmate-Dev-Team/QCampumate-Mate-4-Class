import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common'
import { UsersController } from './users.controller';
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'

describe('UsersController', () => {
  let controller: UsersController;
  let authServiceMock: Partial<AuthService>
  let usersServiceMock: Partial<UsersService>
  
  beforeEach(async () => {
    usersServiceMock = {
      find(email: string) {
        return Promise.resolve([{ id: 1, email, password:"12345" } as User])
      }, 

      findOne(id: number) {
        return Promise.resolve({ id, email: "miyamori@nilumbra.me", password:"12345" } as User)
      }

      // update(id: number) {

      // }

      // remove(id: number) {

      // }
    }

    authServiceMock = {
      // register(email: string, password: string) {

      // }

      authenticateUser(email: string, password: string) {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: UsersService,
          useValue: usersServiceMock
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('can find all users who have the given email', async () => { 
    const email = "papurika@ucb.edu"
    const users = await controller.findAllUsersHasEmail(email)

    // Unique constraint on user.email
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual(email)
  })

  it('can find a user by id', async () => { 
    const id:string = '1'
    const user = await controller.findUser(id)

    // Unique constraint on user.email
    expect(user).toBeDefined()
    expect(user.id).toEqual(parseInt(id))
  })

  it('raises a BadRequestException when the user with given id is not found(#findUser)', async () => { 
    usersServiceMock.findOne = (id: number) => Promise.resolve(null)
    
    const id:string = '1'
    expect(
      controller.findUser(id)
    ).rejects.toThrow(NotFoundException)
  })

  it('can sign in a user and update session object', async() => {
    const session = { userId: null }
    const user = await controller.signin(
      { email: 'mock@mock.edu', password: '123123'},
      session)

    expect(session.userId).toEqual(1)
    expect(user).toBeDefined()
  })
});
