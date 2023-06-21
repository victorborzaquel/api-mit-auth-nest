import { ApiCreatedResponse, ApiProperty } from '@nestjs/swagger';

@ApiCreatedResponse()
export class CreateUserDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  login: string;
}
