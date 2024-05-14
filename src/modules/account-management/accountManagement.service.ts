/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import lodash from 'lodash';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { InjectModel } from '../../transformers/model.transformer';
import { AccountManagementModel } from './models/accountManagement.model';

import { decodeMD5 } from '../../transformers/codec.transformer';
import {
  createAccountDTO,
  filterAccountDto,
  updateAccountDTO,
} from './dto/accountManagement.dto';

import { Types } from 'mongoose';
import * as APP_CONFIG from '../../app.config';
import { USER_TYPE } from '@app/constants/account';

@Injectable()
export class AccountManagerService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(AccountManagementModel)
    private readonly accountManagementModel: MongooseModel<AccountManagementModel>,
  ) {}

  private comparePasswords(oldPwd: string, originPwd: string): boolean {
    const hashedInputPassword = decodeMD5(oldPwd);
    return originPwd === hashedInputPassword;
  }

  // VALIDATE AUTH DATA
  public validateAuthData(payload: any): Promise<any> {
    console.log('payload', payload);
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    return isVerified ? payload.data : null;
  }

  //CREATE ACCOUNT
  public async createAccount(
    createAccountDto: createAccountDTO,
    data_request: any,
  ): Promise<any> {
    try {
      const role = data_request.role;
      const userName = createAccountDto.username.trim();
      const duplicateUserName = await this.accountManagementModel.findOne({
        username: { $regex: new RegExp(`^${userName}$`, 'i') },
      });
      if (role === USER_TYPE.ADMIN) {
        return {
          status: 400,
          message: 'Tài khoản không có quyền !',
        };
      }
      if (duplicateUserName) {
        return {
          status: 400,
          message: 'Account này đã tồn tại',
        };
      }
      const passwordHash = decodeMD5(createAccountDto.password);
      const newAccount = new this.accountManagementModel({
        username: userName,
        password: passwordHash,
      });
      return newAccount.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //GET ALL ACCOUNT
  public async getAllAccount(
    BodyGetAllAccountData: filterAccountDto,
  ): Promise<any> {
    try {
      const { data } = BodyGetAllAccountData;
      const items_per_page = Number(data?.items_per_page) || 10;
      const page = Number(data?.page) + 1 || 1;
      const keyword = data?.keyword || '';
      const status = data?.status || 'all';
      const filter: any = {};

      if (status !== 'all') {
        filter.status = status;
      }

      if (keyword) {
        filter.$or = [{ username: { $regex: keyword, $options: 'i' } }];
      }
      const dataRes = await this.accountManagementModel
        .find(filter)
        .select(['-password', '-role'])
        .limit(items_per_page)
        .skip(1)
        .exec();

      const totalCount =
        await this.accountManagementModel.countDocuments(filter);
      const lastPage = Math.ceil(totalCount / items_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      return {
        dataRes,
        totalCount,
        currentPage: page,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching accounts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //GET DETAIL ACCOUNT
  public async getDetailAccount(id: string): Promise<any> {
    try {
      const account = await this.accountManagementModel
        .findById(id)
        .select('-password')
        .exec();
      if (!account) {
        throw new HttpException('Account not found !', HttpStatus.NOT_FOUND);
      }
      return { data: account };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // UPDATE ACCOUNT and suspend-active account
  public async updateAccount(
    id: string,
    updateAccountDto: updateAccountDTO,
  ): Promise<any> {
    try {
      const { oldPassword, password } = updateAccountDto;
      const account = await this.accountManagementModel.findById(id).exec();

      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      const isMatch = this.comparePasswords(
        String(oldPassword),
        String(account?.password),
      );

      if (!isMatch) {
        throw new HttpException(
          'Old password is incorrect',
          HttpStatus.FORBIDDEN,
        );
      }

      const newPwd = decodeMD5(String(password));

      // if (updateAccountDto.password === '') {
      //   delete updateAccountDto.password;
      // } else if (updateAccountDto.password) {
      //   const passwordHash = decodeMD5(updateAccountDto.password);
      //   updateAccountDto.password = passwordHash;
      // }
      // const accountUpdate = { ...updateAccountDto };
      // const objectId = new Types.ObjectId(id);
      // await this.accountManagementModel.findOneAndUpdate(
      //   { _id: objectId },
      //   accountUpdate,
      //   { new: true },
      // );
    } catch (error) {
      console.error('Error updating account:', error);
      throw new HttpException(
        'An error occurred while updating the account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
