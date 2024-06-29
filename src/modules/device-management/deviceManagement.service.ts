/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import lodash from 'lodash';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import * as APP_CONFIG from '../../app.config';
import { MongooseModel } from '../../interfaces/mongoose.interface';
import { InjectModel } from '../../transformers/model.transformer';
import {
  AddNumberDetailToDeviceDto,
  CreateUpdateDeviceDTO,
  DetailDeviceDto,
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
  ): Promise<DeviceManagementModel> {
    try {
      const details: DetailDeviceDto[] = [];
      for (let i = 0; i < createDeviceDto.quantity; i++) {
        const id_device =
          await `${createDeviceDto.name}-${uuidv4().substring(0, 8)}`;
        details.push({
          status: 'inventory',
          id_device,
        });
      }

      const newCreateDeviceDto = {
        name: createDeviceDto.name,
        sub_category_id: createDeviceDto.sub_category_id,
        cost: createDeviceDto.cost,
        note: createDeviceDto.note,
        detail: details,
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
      const filter: any = {};

      if (keyword) {
        filter.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { _id: { $regex: keyword, $options: 'i' } },
        ];
      }

      const queryBuilder = this.deviceManagementModel.find(filter);

      if (hasQuery) {
        queryBuilder.limit(items_per_page).skip(skip);
      }

      const data = await queryBuilder.sort({ regDt: -1 }).exec();

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
  public async addNumberDetailToDevice(
    id: string,
    addNumberDetailToDeviceDto: AddNumberDetailToDeviceDto,
  ): Promise<any> {
    try {
      const newDetails: DetailDeviceDto[] = [];
      for (let i = 0; i < addNumberDetailToDeviceDto.quantity; i++) {
        newDetails.push({
          status: 'inventory',
          id_device: `${addNumberDetailToDeviceDto.name}-${uuidv4().substring(0, 8)}`,
        });
      }

      const objectId = new Types.ObjectId(id);
      const updateDevice = await this.deviceManagementModel.findOneAndUpdate(
        { _id: objectId },
        { $push: { detail: { $each: newDetails } } },
        { new: true },
      );
      return updateDevice;
    } catch (error) {
      console.error('Error add detail to device:', error);
      throw new HttpException(
        'An error occurred while add detail to device',
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
