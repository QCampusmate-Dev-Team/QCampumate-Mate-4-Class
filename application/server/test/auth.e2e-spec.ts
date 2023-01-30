import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/signin', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
      
  // });

  it('/auth/signup (can sign up)', () => {
    const email =  'nilumbra@ucb.edu'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'authenticity' })
      .expect(201)
      .then(res => {
        const { id, email } = res.body
        expect(id).toBeDefined()
        expect(email).toEqual(email)
      })
  });

  it('/auth/signup + /whoami', async () => {
    const email = 'nilumbra@gtech.edu'

    // can sign up 
    const res = await request(app.getHttpServer()).post('/auth/signup')
      .send({ email, password:'asdf' })
      .expect(201)
    const cookie = res.get('Set-Cookie')

    // after a signed up request, /auth/whoami should return the signed-up user
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie) // mock the request header 'Set-Cookie' 
      .expect(200)
    
    expect(body.email).toEqual(email)
    
    }
  )
});
