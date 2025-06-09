import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TodoLists (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('TodoLists', () => {
    it('GET /api/todolists', () => {
      return request(app.getHttpServer())
        .get('/api/todolists')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
        });
    });

    it('POST /api/todolists', () => {
      return request(app.getHttpServer())
        .post('/api/todolists')
        .send({ name: 'Lista de Test' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Lista de Test');
        });
    });
  });

  describe('TodoItems', () => {
    let listId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/api/todolists')
        .send({ name: 'Lista para Items' });
      listId = response.body.id;
    });

    it('POST /todo-lists/:listId/items', () => {
      return request(app.getHttpServer())
        .post(`/todo-lists/${listId}/items`)
        .send({ description: 'Item de prueba' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('description');
          expect(res.body.description).toBe('Item de prueba');
          expect(res.body.completed).toBe(false);
        });
    });

    it('GET /todo-lists/:listId/items', async () => {
      await request(app.getHttpServer())
        .post(`/todo-lists/${listId}/items`)
        .send({ description: 'Item para listar' });

      return request(app.getHttpServer())
        .get(`/todo-lists/${listId}/items`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('description');
          expect(res.body[0]).toHaveProperty('completed');
        });
    });

    it('PUT /todo-lists/:listId/items/:id/complete', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/todo-lists/${listId}/items`)
        .send({ description: 'Item para completar' });

      const itemId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/todo-lists/${listId}/items/${itemId}/complete`)
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(true);
        });
    });
  });
});
