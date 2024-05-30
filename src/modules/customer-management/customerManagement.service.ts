import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CustomerMngDTO,
  ListCustomerDto,
  QueryCustomerDto,
} from './dto/customerManagement.dto';
import { CustomerManagementModel } from './models/customerManagement.model';
import { Types } from 'mongoose';

@Injectable()
export class CustomerManagerService {
  constructor(
    @InjectModel(CustomerManagementModel)
    private readonly customerManagementModel: MongooseModel<CustomerManagementModel>,
  ) {}

  public async getAllCustomer(
    query: QueryCustomerDto,
  ): Promise<ListCustomerDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        filter.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { phone: { $regex: keyword, $options: 'i' } },
        ];
      }

      const dataRes = await this.customerManagementModel
        .find(filter)
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount =
        await this.customerManagementModel.countDocuments(filter);
      const lastPage = Math.ceil(totalCount / items_per_page);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      return {
        data: dataRes,
        totalCount,
        currentPage: page,
        lastPage,
        nextPage,
        prevPage,
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching customers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createCustomer(
    body: CustomerMngDTO,
  ): Promise<CustomerManagementModel> {
    const { email } = body;
    const duplicateEmailCustomer = await this.customerManagementModel.findOne({
      email,
    });

    if (duplicateEmailCustomer) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const newCustomer = new this.customerManagementModel(body);
    return newCustomer.save();
  }

  public async getCustomerById(id: string): Promise<CustomerManagementModel> {
    try {
      const customer = await this.customerManagementModel.findById(id).exec();
      if (!customer) {
        throw new HttpException('Customer not exists !', HttpStatus.NOT_FOUND);
      }
      return customer;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateCustomerById(
    id: string,
    body: CustomerMngDTO,
  ): Promise<CustomerManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);
      const newCustomer = await this.customerManagementModel.findOneAndUpdate(
        { _id: objectId },
        body,
        { new: true },
      );

      return newCustomer as CustomerManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteCustomerById(
    id: string,
  ): Promise<CustomerManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);
      const deleteCustomer =
        await this.customerManagementModel.findOneAndDelete({
          _id: objectId,
        });
      return deleteCustomer as CustomerManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while delete the customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
