/* eslint-disable prettier/prettier */
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { decodeMD5 } from '../../transformers/codec.transformer';
import { InjectModel } from '../../transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountManagementModel } from '../account-management/models/accountManagement.model';
import { AuthLoginDTO } from './dto/auth.dto';
import { USER_STATUS } from '../../constants/account';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(AccountManagementModel)
    private readonly accountManagementModel: MongooseModel<AccountManagementModel>,
  ) {}

  public createToken(payload?: any, user?: any): any {
    return {
      access_token: this.jwtService.sign({ data: payload }),
      data: { ...user },
    };
  }

  public async login(loginDto: AuthLoginDTO): Promise<any> {
    const user = await this.accountManagementModel
      .findOne({
        username: loginDto.username,
      })
      .lean();
    if (!user) {
      throw new HttpException('Account is not exist', HttpStatus.UNAUTHORIZED);
    }
    if (user.status === USER_STATUS.INACTIVE) {
      throw new HttpException('Account is suspended', HttpStatus.UNAUTHORIZED);
    }

    const loginPassword = decodeMD5(loginDto.password);
    if (loginPassword === user.password) {
      const payload = {
        username: user.username,
        role: user.role,
        id: user._id,
      };
      return this.createToken(payload, {
        id: user._id,
        role: user.role,
        status: user.status,
        username: user.username,
      });
    } else {
      throw new HttpException(
        'Password is not correct !',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
