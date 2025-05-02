import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @Get('/decode/:code')
  @ApiOperation({ summary: 'Decode a shortened URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns the original URL for the given short code',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          originalUrl: 'https://indicina.co/',
        },
      },
    },
  })
  decode(@Param('code') code: string) {
    return this.urlService.decodeShortUrl(code);
  }

  @Get('/list')
  @ApiOperation({
    summary: 'List all shortened URLs with optional search and pagination',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of shortened URLs',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          data: [
            {
              id: 'uuid',
              shortCode: 'abc123',
              originalUrl: 'https://indicina.co',
              createdAt: '2024-01-01T00:00:00Z',
              visitCount: 5,
              searchCount: 2,
              status: 'ACTIVE',
            },
          ],
          totalCount: 1,
          totalPages: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    },
  })
  listUrls(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.urlService.listAllShortenedUrls(search, page, limit);
  }

  @Get('/statistic/:url_path')
  @ApiOperation({ summary: 'Get statistics for a shortened URL' })
  @ApiResponse({
    status: 200,
    description: 'Returns metadata for a specific short URL',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        message: 'Success',
        data: {
          id: 'uuid',
          shortCode: 'abc123',
          originalUrl: 'https://indicina.co',
          createdAt: '2024-01-01T00:00:00Z',
          visitCount: 5,
          searchCount: 2,
          status: 'ACTIVE',
        },
      },
    },
  })
  getUrlStatistics(@Param('url_path') code: string) {
    return this.urlService.getUrlStatistics(code);
  }
}
