import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Status } from '../common/enums/enums';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    encodeLongUrl: jest.fn(),
    decodeShortUrl: jest.fn(),
    listAllShortenedUrls: jest.fn(),
    getUrlStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test the encode endpoint logic
  it('should call urlService.encodeLongUrl and return the shortened URL', () => {
    const dto: CreateUrlDto = { url: 'https://indicina.co' };

    const mockResult = {
      shortUrl: 'https://sho.rt/GeAi9K',
      code: 'GeAi9K',
    };

    const spy = jest
      .spyOn(service, 'encodeLongUrl')
      .mockReturnValue(mockResult);

    const result = controller.encode(dto);

    expect(spy).toHaveBeenCalledWith(dto.url);
    expect(result).toEqual(mockResult);
  });

  // Test the decode endpoint logic
  it('should call urlService.decodeShortUrl and return the original URL', () => {
    const shortCode = 'GeAi9K';

    const mockResult = {
      originalUrl: 'https://indicina.co',
    };

    const spy = jest
      .spyOn(service, 'decodeShortUrl')
      .mockReturnValue(mockResult);

    const result = controller.decode(shortCode);

    expect(spy).toHaveBeenCalledWith(shortCode);
    expect(result).toEqual(mockResult);
  });

  // Test for listAllShortenedUrls (paginated and search functionality)
  it('should call urlService.listAllShortenedUrls and return paginated data', () => {
    const mockResult = {
      urls: [
        {
          id: 'uuid',
          shortCode: 'abc123',
          originalUrl: 'https://indicina.co',
          createdAt: new Date(),
          visitCount: 5,
          searchCount: 2,
          status: Status.ACTIVE,
        },
      ],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    const spy = jest
      .spyOn(service, 'listAllShortenedUrls')
      .mockReturnValue(mockResult);

    const result = controller.listUrls('indicina', 1, 10);

    expect(spy).toHaveBeenCalledWith('indicina', 1, 10);
    expect(result).toEqual(mockResult);
  });

  // Test when no URLs are found (empty data)
  it('should return empty data when no URLs are found', () => {
    const mockResult = {
      urls: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };

    const spy = jest
      .spyOn(service, 'listAllShortenedUrls')
      .mockReturnValue(mockResult);

    const result = controller.listUrls('', 1, 10);

    expect(spy).toHaveBeenCalledWith('', 1, 10);
    expect(result).toEqual(mockResult);
  });

  it('should call urlService.getUrlStatistics and return the result', () => {
    const mockResult = {
      id: 'uuid',
      shortCode: 'abc123',
      originalUrl: 'https://indicina.co',
      createdAt: new Date(),
      visitCount: 5,
      searchCount: 2,
      status: Status.ACTIVE,
    };

    const spy = jest
      .spyOn(service, 'getUrlStatistics')
      .mockReturnValue(mockResult);

    const result = controller.getUrlStatistics('abc123');

    expect(spy).toHaveBeenCalledWith('abc123');
    expect(result).toEqual(mockResult);
  });
});
