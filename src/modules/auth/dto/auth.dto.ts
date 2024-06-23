/* eslint-disable prettier/prettier */
import { IsString, IsDefined, IsNotEmpty } from 'class-validator';

export class AuthLoginDTO {
  @IsString({ message: 'username must be string type' })
  @IsNotEmpty({ message: 'username?' })
  @IsDefined()
  username: string;

  @IsString({ message: 'password must be string type' })
  @IsNotEmpty({ message: 'password?' })
  @IsDefined()
  password: string;
}
