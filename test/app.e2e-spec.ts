import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import e from 'express';


const jwToken = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfdHlwZSI6ImFjY2Vzc190b2tlbiIsInVpZCI6ImYxODk5OTAyLTg0OTQtNDMyMC1hOTc1LTQ5Zjk1ZGU5MjQ4YiIsImVtYWlsIjoiZXhhbXBsZVRlc3RAZXhlLmNvbSIsImlhdCI6MTY2MDEyNzM4OCwiZXhwIjoxNzIxMjEyNzM4OH0.BFod3qbQesM7qbANYRpUZD1V5vlQ9tckS-4TS8FePhk",
  expire: "180000d"
}

const user= {
  email: Date.now().toString()+"_exampleTest@exe.com",
  password: "mpwAleaw1",
  nickname: Date.now().toString()+"_Name"
}

const tags = [];


describe('App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(res=>{
        expect(res.body).toEqual({
          msg: expect.any(String)
        })
      });
  });

  describe('Auth', ()=>{
    it('/auth/signup (POST)', () => {
      return request(app.getHttpServer())
            .post('/auth/signup')
            .set('Accept', 'application/json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(res=> {
              expect(res.body).toEqual({
                token: expect.any(String),
                expire: expect.any(String)
              })
            });
    });

    it('/auth/signup (POST) | status:400', () => {
      return request(app.getHttpServer())
            .post('/auth/signup')
            .set('Accept', 'application/json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(res=> {
              expect(res.body).toEqual({
                message: expect.any(String),
                statusCode: expect.any(Number)
              })
            });
    });
  
    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
            .post('/auth/login')
            .set('Accept', 'application/json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              if(res.body.token) jwToken.token = res.body.token;
              expect(res.body).toEqual({
                token: expect.any(String),
                expire: expect.any(String)
              });
            });
    });

    it('/auth/logout (GET)', () => {
      return request(app.getHttpServer())
            .get('/auth/logout')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                message: expect.any(String),
                statusCode: expect.any(Number)
              })
            });
    });

    it('/auth/token/refresh (GET)', () => {
      return request(app.getHttpServer())
            .get('/auth/token/refresh')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              if(res.body.token) jwToken.token = res.body.token;
              expect(res.body).toEqual({
                token: expect.any(String),
                expire: expect.any(String)
              });
            });
    });

  });

  
  describe('Tag', ()=>{
    it('/tag (POST)', () => {
        const tag = {
        name: Date.now().toString()+'_tag',
        sortOrder: Math.ceil(Math.random()*40)
      }

      return request(app.getHttpServer())
            .post('/tag')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send(tag)
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(res=> {
              tags.push(res.body.id);
              expect(res.body).toEqual({
                id: expect.any(Number),
                name: expect.any(String),
                sortOrder: expect.any(Number)
              })
            });
    });

    it('/tag?sortByOrder (GET)', () => {
      return request(app.getHttpServer())
            .get('/tag')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(async function(res) {
              expect(res.body).toEqual({
                data: expect.arrayContaining([]),
                meta:expect.objectContaining({
                  offset: expect.any(Number),
                  length: expect.any(Number),
                  quantity: expect.any(Number)
                })
              });
            });
    });

    it('/tag/{id} (GET)', () => {
      return request(app.getHttpServer())
            .get(`/tag/${tags[0]}`)
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(async function(res) {
              expect(res.body).toEqual({
                name: expect.any(String),
                sortOrder: expect.any(Number),
                creator:expect.objectContaining({
                  uid: expect.any(String),
                  nickname: expect.any(String)
                })
              });
            });
    });

    it('/tag/{id} (PUT)', () => {
      const tag = {
        name: Date.now().toString()+'_tag',
        sortOrder: Math.ceil(Math.random()*40)
      }

      return request(app.getHttpServer())
            .put(`/tag/${tags[0]}`)
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send(tag)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                name: expect.any(String),
                sortOrder: expect.any(Number),
                creator:expect.objectContaining({
                  uid: expect.any(String),
                  nickname: expect.any(String)
                })
              })
            });
    });

  });

  
  describe('User', ()=>{

    it('/user (PUT)', () => {
      const newFields= {
        email: Date.now().toString()+"_exampleTest@exe.com",
        password:  Date.now().toString()+"mpwAleaw1",
        nickname: Date.now().toString()+"_Name"
      }

      return request(app.getHttpServer())
            .put('/user')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send(newFields)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                email: expect.any(String),
                nickname: expect.any(String)
              })
            });
    });

    it('/user/tag/my (GET)', () => {
      return request(app.getHttpServer())
            .get('/user/tag/my')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                tags: expect.arrayContaining([])
              })
            });
    });

    it('/user/tag (POST)', () => {
      return request(app.getHttpServer())
            .post('/user/tag')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .send({tags})
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                tags: expect.arrayContaining([])
              })
            });
    });

    it('/user (GET)', () => {
      return request(app.getHttpServer())
            .get('/user')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                email: expect.any(String),
                nickname: expect.any(String),
                tags: expect.arrayContaining([])
              })
            });
    });

    it('/user/tag/{id} (DELETE)', () => {
      return request(app.getHttpServer())
            .delete(`/user/tag/${tags[0]}`)
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              expect(res.body).toEqual({
                tags: expect.arrayContaining([])
              })
            });
    });

    
  });


  describe('Tag DELETE', ()=>{

    it('/tag/{id} (DELETE)', () => {
      return request(app.getHttpServer())
            .delete(`/tag/${tags[0]}`)
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(res=> {
              tags.pop();
            });
    });

  });

  describe('User DELETE', ()=>{
    it('/user (DELETE)', () => {
      return request(app.getHttpServer())
            .delete('/user')
            .auth(jwToken.token, { type: 'bearer' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
    });
  });

});
