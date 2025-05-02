import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { AppModule } from '../src/app.module';
import { UrlStore } from '../src/common/storage/url.store';
import { Status } from '../src/common/enums/enums';

describe('GET /:url_path (redirect)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should redirect to the original URL if code exists and is ACTIVE', async () => {
    const code = 'abc123';
    const originalUrl = 'https://indicina.co';

    UrlStore.set(code, {
      id: uuidv4(),
      shortCode: code,
      originalUrl,
      createdAt: new Date(),
      visitCount: 0,
      searchCount: 0,
      status: Status.ACTIVE,
    });

    const response = await request(app.getHttpServer())
      .get(`/${code}`)
      .expect(302);
    expect(response.headers['location']).toBe(originalUrl);
  });

  it('should return 404 if code does not exist', async () => {
    await request(app.getHttpServer()).get('/nonexistent').expect(404);
  });

  it('should return 404 if code exists but is INACTIVE', async () => {
    const code = 'deadcode';

    UrlStore.set(code, {
      id: uuidv4(),
      shortCode: code,
      originalUrl: 'https://blocked.com',
      createdAt: new Date(),
      visitCount: 0,
      searchCount: 0,
      status: Status.INACTIVE,
    });

    await request(app.getHttpServer()).get(`/${code}`).expect(404);
  });
});
