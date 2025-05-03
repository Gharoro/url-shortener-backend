import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
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
      id: uuidv4(),
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

  // Encode a URL and verify storage and return structure
  it('should encode a URL and store the entry in UrlStore', () => {
    const originalUrl = 'https://indicina.co';

    // Call the encode method
    const result = service.encodeLongUrl(originalUrl);

    // Check the returned structure has the shortUrl and code properties
    expect(result).toHaveProperty('shortUrl');
    expect(result).toHaveProperty('code');

    // Retrieve the entry from the UrlStore using the generated code
    const entry = UrlStore.get(result.code);

    // Check if the entry exists in UrlStore
    expect(entry).toBeDefined();

    // If entry is not found, throw an error to make sure it's stored properly
    if (!entry) throw new Error('Entry was not stored correctly');

    // Check if the stored entry has the expected properties
    expect(entry.originalUrl).toBe(originalUrl);
    expect(entry.status).toBe(Status.ACTIVE);
    expect(entry.visitCount).toBe(0);
    expect(typeof entry.id).toBe('string');
  });

  // Decode a valid short code and return the original URL
  it('should return originalUrl if short code exists and status is ACTIVE', () => {
    const code = 'GeAi9K';
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

    const result = service.decodeShortUrl(code);

    expect(result).toEqual({ originalUrl });
  });

  // Return null if short code does not exist
  it('should return null if short code is not found', () => {
    const result = service.decodeShortUrl('nonexistent');
    expect(result).toBeNull();
  });

  // Return null if short code exists but status is not ACTIVE
  it('should return null if short code status is not ACTIVE', () => {
    const code = 'InactiveCode';
    const originalUrl = 'https://indicina.co';

    UrlStore.set(code, {
      id: uuidv4(),
      shortCode: code,
      originalUrl,
      createdAt: new Date(),
      visitCount: 0,
      searchCount: 0,
      status: Status.INACTIVE,
    });

    const result = service.decodeShortUrl(code);
    expect(result).toBeNull();
  });

  it('should return paginated results without search', () => {
    // Insert 3 dummy URLs
    for (let i = 1; i <= 3; i++) {
      UrlStore.set(`code${i}`, {
        id: uuidv4(),
        shortCode: `code${i}`,
        originalUrl: `https://example${i}.com`,
        createdAt: new Date(),
        visitCount: i,
        searchCount: i,
        status: Status.ACTIVE,
      });
    }

    const result = service.listAllShortenedUrls(undefined, 1, 2);

    expect(result.urls.length).toBe(2);
    expect(result.pagination.totalCount).toBe(3);
    expect(result.pagination.totalPages).toBe(2);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.hasNextPage).toBe(true);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it('should return filtered results when search is provided', () => {
    UrlStore.clear();
    UrlStore.set('abc123', {
      id: uuidv4(),
      shortCode: 'abc123',
      originalUrl: 'https://indicina.co',
      createdAt: new Date(),
      visitCount: 10,
      searchCount: 5,
      status: Status.ACTIVE,
    });

    UrlStore.set('def456', {
      id: uuidv4(),
      shortCode: 'def456',
      originalUrl: 'https://google.com',
      createdAt: new Date(),
      visitCount: 8,
      searchCount: 2,
      status: Status.ACTIVE,
    });

    const result = service.listAllShortenedUrls('indicina');

    expect(result.urls.length).toBe(1);
    expect(result.urls[0].originalUrl).toBe('https://indicina.co');
    expect(result.pagination.totalCount).toBe(1);
  });

  it('should handle empty UrlStore', () => {
    UrlStore.clear();

    const result = service.listAllShortenedUrls();

    expect(result.urls).toEqual([]);
    expect(result.pagination.totalCount).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.currentPage).toBe(1);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });

  it('should return URL metadata if code exists', () => {
    const code = 'abc123';

    const entry: ShortenedURL = {
      id: uuidv4(),
      shortCode: code,
      originalUrl: 'https://indicina.co',
      createdAt: new Date(),
      visitCount: 5,
      searchCount: 2,
      status: Status.ACTIVE,
    };

    UrlStore.set(code, entry);

    const result = service.getUrlStatistics(code);

    expect(result).toEqual({
      ...entry,
      visitCount: (entry.visitCount || 0) + 1,
    });
  });

  it('should return null if code does not exist', () => {
    UrlStore.clear();

    const result = service.getUrlStatistics('nonexistent');
    expect(result).toBeNull();
  });
});
