/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDTO {
  @IsString({ message: 'username must be string type' })
  @IsNotEmpty({ message: 'username is not empty !' })
  @IsDefined()
  username: string;

  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password is not empty !' })
  @IsDefined()
  password: string;
}

export class createAccountDTO {
  @IsString({ message: 'username must be string type' })
  @IsNotEmpty({ message: 'username is not empty !' })
  @IsDefined()
  username: string;

  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password is not empty !' })
  @IsDefined()
  password: string;
}
export class updateAccountDTO {
  password?: string;
  status?: string;
  oldPassword?: string;
}

export class filterAccountDto {
  @ApiProperty({ required: false })
  page: number;
  @ApiProperty({ required: false })
  items_per_page: number;
  @ApiProperty({ required: false })
  keyword: string;
  @ApiProperty({ required: false })
  status: string;
}

export interface TokenResult {
  access_token: string;
  expires_in: number;
}
