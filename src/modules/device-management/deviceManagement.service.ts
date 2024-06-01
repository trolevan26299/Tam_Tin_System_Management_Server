/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import lodash from 'lodash';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { InjectModel } from '../../transformers/model.transformer';
import { DeviceManagementModel } from './models/deviceManagement.model';
import { Types } from 'mongoose';
import * as APP_CONFIG from '../../app.config';
import {
  CreateUpdateDeviceDTO,
  filterDeviceDto,
} from './dto/deviceManagement.dto';

@Injectable()
export class DeviceManagerService {
  constructor(
    @InjectModel(DeviceManagementModel)
    private readonly deviceManagementModel: MongooseModel<DeviceManagementModel>,
  ) {}

  // VALIDATE AUTH DATA
  public validateAuthData(payload: any): Promise<any> {
    console.log('payload', payload);
    const isVerified = lodash.isEqual(payload.data, APP_CONFIG.AUTH.data);
    return isVerified ? payload.data : null;
  }

  //CREATE DEVICE
  public async createDevice(
    createDeviceDto: CreateUpdateDeviceDTO,
  ): Promise<any> {
    try {
      const id_device = createDeviceDto;
      const duplicateIdDevice = await this.deviceManagementModel.findOne({
        id_device: { $regex: new RegExp(`^${id_device}$`, 'i') },
      });

      if (duplicateIdDevice) {
        return {
          status: 400,
          message: 'Sản phẩm này đã bị trùng Id , Vui lòng cung cấp Id khác !',
        };
      }

      const newDevice = new this.deviceManagementModel(createDeviceDto);
      return newDevice.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the device',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //GET ALL DEVICE
  public async getAllDevice(QueryAllDeviceData: filterDeviceDto): Promise<any> {
    try {
      const query = QueryAllDeviceData;
      const items_per_page = Number(query?.items_per_page) || 10;
      const page = Number(query?.page) + 1 || 1;
      const skip = (page - 1) * items_per_page;
      const keyword = query?.keyword || '';
      const status = query?.status || 'all';
      const belongToId = query?.belong_to;
      const filter: any = {};

      if (status !== 'all') {
        filter.status = status;
      }

      if (keyword) {
        filter.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { id_device: { $regex: keyword, $options: 'i' } },
        ];
      }

      if (belongToId) {
        filter.belong_to = belongToId;
      }

      const dataRes = await this.deviceManagementModel
        .find(filter)
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount =
        await this.deviceManagementModel.countDocuments(filter);
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
        'An error occurred while fetching devices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //GET DETAIL DEVICE
  public async getDetailDevice(id: string): Promise<any> {
    try {
      const device = await this.deviceManagementModel.findById(id).exec();
      if (!device) {
        throw new HttpException('Device not found !', HttpStatus.NOT_FOUND);
      }
      return { data: device };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the device',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // UPDATE DEVICE
  public async updateDevice(
    id: string,
    updateDeviceDto: CreateUpdateDeviceDTO,
  ): Promise<any> {
    try {
      const accountUpdate = { ...updateDeviceDto };
      const objectId = new Types.ObjectId(id);
      const updateDevice = await this.deviceManagementModel.findOneAndUpdate(
        { _id: objectId },
        accountUpdate,
        { new: true },
      );
      return updateDevice;
    } catch (error) {
      console.error('Error updating device:', error);
      throw new HttpException(
        'An error occurred while updating the device',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // DELETE DEVICE
  public async deleteDevice(id: string): Promise<any> {
    try {
      const objectId = new Types.ObjectId(id);
      const deleteDevice = await this.deviceManagementModel.findOneAndDelete({
        _id: objectId,
      });
      return deleteDevice;
    } catch (error) {
      console.error('Error delete device:', error);
      throw new HttpException(
        'An error occurred while delete the device',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
