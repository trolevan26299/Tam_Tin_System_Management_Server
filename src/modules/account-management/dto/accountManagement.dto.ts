/* eslint-disable prettier/prettier */
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
}

export class filterAccountDto {
  data: {
    page?: string;
    items_per_page?: string;
    keyword?: string;
    status: string;
  };
}

export interface TokenResult {
  access_token: string;
  expires_in: number;
}
