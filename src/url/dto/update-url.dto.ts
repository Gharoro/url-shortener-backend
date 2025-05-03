import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Status } from '../../common/enums/enums';

export class UpdateUrlDto {
  @ApiProperty({
    description: 'The new status',
    example: 'In Active',
  })
  @IsEnum(Status, { message: 'Invalid URL status' })
  status: Status;
}
