/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import lodash from 'lodash';
import moment from 'moment';
import { Types } from 'mongoose';
import * as APP_CONFIG from '../../app.config';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { InjectModel } from '../../transformers/model.transformer';
import {
  CreateUpdateDeviceDTO,
  filterDeviceDto,
} from './dto/deviceManagement.dto';
import { DeviceManagementModel } from './models/deviceManagement.model';

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
        throw new HttpException(
          'Sản phẩm này đã bị trùng Id , Vui lòng cung cấp Id khác !',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newCreateDeviceDto = {
        ...createDeviceDto,
        status: [...createDeviceDto.status, { status: 'sold', quantity: 0 }],
        regDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };

      const newDevice = new this.deviceManagementModel(newCreateDeviceDto);
      return newDevice.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while creating the device',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //GET ALL DEVICE
  public async getAllDevice(query: filterDeviceDto): Promise<any> {
    try {
      const hasQuery = Object.keys(query).length > 0;
      const items_per_page =
        hasQuery && query.items_per_page ? Number(query.items_per_page) : 10;
      const page = hasQuery && query.page ? Number(query.page) + 1 : 1;
      const skip = (page - 1) * items_per_page;
      const keyword = query?.keyword || '';
      const status = query?.status || 'all';
      const filter: any = {};

      if (keyword) {
        filter.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { id_device: { $regex: keyword, $options: 'i' } },
        ];
      }

      const queryBuilder = this.deviceManagementModel.find(filter);

      if (hasQuery) {
        queryBuilder.limit(items_per_page).skip(skip);
      }

      let data = await queryBuilder.sort({ regDt: -1 }).exec();

      if (status === 'sold') {
        data = data.filter((device) => {
          const soldStatus = device.status.find(
            (status) => status.status === 'sold',
          );
          return soldStatus && soldStatus.quantity > 0;
        });
      } else if (status === 'inventory') {
        data = data?.filter((device) => {
          const inventoryStatus = device.status.find(
            (status) => status.status === 'inventory',
          );
          return inventoryStatus && inventoryStatus.quantity > 0;
        });
      }

      const totalCount =
        await this.deviceManagementModel.countDocuments(filter);
      const lastPage = Math.ceil(totalCount / items_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      return {
        data,
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
      const deviceUpdate = {
        ...updateDeviceDto,
        modDt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
      const objectId = new Types.ObjectId(id);
      const updateDevice = await this.deviceManagementModel.findOneAndUpdate(
        { _id: objectId },
        deviceUpdate,
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
