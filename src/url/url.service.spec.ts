import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { ShortenedURL, UrlStore } from '../common/storage/url.store';
import { Status } from '../common/enums/enums';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    UrlStore.clear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Generate a short code of 6 alphanumeric characters
  it('should generate a 6-character alphanumeric short code', () => {
    const code = service['generateShortCode']();
    expect(code).toMatch(/^[a-z0-9]{6}$/);
  });

  // Ensure generated short code is unique
  it('should generate a unique short code', () => {
    const code1 = service['generateShortCode']();

    const dummyRecord: ShortenedURL = {
      id: 'test-id',
      shortCode: code1,
      originalUrl: 'https://dummy.com',
      createdAt: new Date(),
      visitCount: 0,
      searchCount: 0,
      status: Status.ACTIVE,
    };

    UrlStore.set(code1, dummyRecord);

    const code2 = service['generateShortCode']();
    expect(code2).not.toBe(code1);
  });

  // Encode a URL and verify storage and return structure
  it('should encode a URL and store the entry in UrlStore', () => {
    const result = service.encodeLongUrl('https://indicina.co');

    expect(result).toHaveProperty('shortUrl');
    expect(result).toHaveProperty('code');

    const entry = UrlStore.get(result.code);
    expect(entry).toBeDefined();

    if (!entry) throw new Error('Entry was not stored correctly');

    expect(entry.originalUrl).toBe('https://indicina.co');
    expect(entry.status).toBe(Status.ACTIVE);
    expect(entry.visitCount).toBe(0);
    expect(typeof entry.id).toBe('string');
  });
});
