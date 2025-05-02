import { Body, Controller, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('URL')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/encode')
  @ApiOperation({ summary: 'Shorten a long URL' })
  @ApiResponse({
    status: 201,
    description: 'Returns a shortened URL and short code',
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: 'Success',
        data: {
          shortUrl: 'https://sho.rt/abc123',
          code: 'abc123',
        },
      },
    },
  })
  encode(@Body() body: CreateUrlDto) {
    return this.urlService.encodeLongUrl(body.url);
  }
}
