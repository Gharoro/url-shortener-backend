import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from '../url.service';
import { UrlStore } from '../../common/storage/url.store';

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':url_path')
  handleRedirect(@Param('url_path') url_path: string, @Res() res: Response) {
    const result = this.urlService.decodeShortUrl(url_path);

    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).send('Short URL not found');
    }

    // Update visit count
    const storeUrl = UrlStore.get(url_path);
    if (storeUrl) {
      UrlStore.set(url_path, {
        ...storeUrl,
        visitCount: (storeUrl.visitCount || 0) + 1,
      });
    }

    return res.redirect(result.originalUrl);
  }
}
