import { Test, TestingModule } from '@nestjs/testing';
import { RedirectController } from './redirect.controller';
import { UrlService } from '../url.service';

describe('RedirectController', () => {
  let controller: RedirectController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedirectController],
      providers: [UrlService],
    }).compile();

    controller = module.get<RedirectController>(RedirectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
