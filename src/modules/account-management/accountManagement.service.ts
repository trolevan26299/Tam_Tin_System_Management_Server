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
  TokenResult,
  updateAccountDTO,
} from './dto/accountManagement.dto';

import { Types } from 'mongoose';
import * as APP_CONFIG from '../../app.config';

@Injectable()
export class AccountManagerService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(AccountManagementModel)
    private readonly accountManagementModel: MongooseModel<AccountManagementModel>,
  ) {}

  // VALIDATE AUTH DATA
  public validateAuthData(payload: any): Promise<any> {
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    return isVerified ? payload.data : null;
  }

  //CREATE TOKEN
  public createToken(payload?: any): TokenResult {
    return {
      access_token: this.jwtService.sign({ data: payload }),
      expires_in: APP_CONFIG.AUTH.expiresIn as number,
    };
  }

  //CREATE ACCOUNT
  public async createAccount(createAccountDto: createAccountDTO): Promise<any> {
    try {
      const userName = createAccountDto.username.trim();
      const duplicateUserName = await this.accountManagementModel.findOne({
        username: { $regex: new RegExp(`^${userName}$`, 'i') },
      });
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
      const skip = (page - 1) * items_per_page;
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
        .limit(items_per_page)
        .skip(skip)
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
      if (updateAccountDto.password === '') {
        delete updateAccountDto.password;
      } else if (updateAccountDto.password) {
        const passwordHash = decodeMD5(updateAccountDto.password);
        updateAccountDto.password = passwordHash;
      }
      const accountUpdate = { ...updateAccountDto };
      const objectId = new Types.ObjectId(id);
      await this.accountManagementModel.findOneAndUpdate(
        { _id: objectId },
        accountUpdate,
        { new: true },
      );
    } catch (error) {
      console.error('Error updating account:', error);
      throw new HttpException(
        'An error occurred while updating the account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
