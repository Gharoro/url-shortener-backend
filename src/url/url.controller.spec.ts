import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    encodeLongUrl: jest.fn(),
    decodeShortUrl: jest.fn(),
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
});
