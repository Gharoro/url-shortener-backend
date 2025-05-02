import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original long URL to shorten',
    example: 'https://indicina.co/',
  })
  @IsUrl({}, { message: 'Invalid URL format' })
  url: string;
}
