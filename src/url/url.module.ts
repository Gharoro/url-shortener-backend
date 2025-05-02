import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { RedirectController } from './redirect/redirect.controller';

@Module({
  controllers: [UrlController, RedirectController],
  providers: [UrlService],
})
export class UrlModule {}
