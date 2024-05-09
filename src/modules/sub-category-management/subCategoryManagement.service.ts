import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  DetailSubCategoryDto,
  ListSubCategoryDto,
  QuerySubCategoryDto,
  SubCategoryDto,
} from './dto/subCategoryManagement.dto';
import { SubCategoryManagementModel } from './models/subCategoryManagement.model';

@Injectable()
export class SubCategoryManagerService {
  constructor(
    @InjectModel(SubCategoryManagementModel)
    private readonly subCategoryManagementModel: MongooseModel<SubCategoryManagementModel>,
  ) {}

  public async createSubCategory(
    body: SubCategoryDto,
  ): Promise<SubCategoryManagementModel> {
    try {
      const newSubCategory = new this.subCategoryManagementModel(body);
      return newSubCategory.save();
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the sub-category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getCategoryById(id: string): Promise<DetailSubCategoryDto> {
    try {
      const subCategory = await this.subCategoryManagementModel
        .findById(id)
        .exec();

      if (!subCategory) {
        throw new HttpException(
          'subCategory is not exists !',
          HttpStatus.NOT_FOUND,
        );
      }

      return { data: subCategory };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the Sub Category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateSubCategory(
    id: string,
    body: SubCategoryDto,
  ): Promise<SubCategoryManagementModel> {
    try {
      const subCategoryUpdate = { ...body };
      const objectId = new Types.ObjectId(id);

      const updateSubCategory =
        await this.subCategoryManagementModel.findOneAndUpdate(
          {
            _id: objectId,
          },
          subCategoryUpdate,
          { new: true },
        );

      return updateSubCategory as SubCategoryManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the sub-category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getListSubCategory(
    query: QuerySubCategoryDto,
  ): Promise<ListSubCategoryDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        filter.$or = [{ name: { $regex: keyword, $option: 'i' } }];
      }

      const dataRes = await this.subCategoryManagementModel
        .find(filter)
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount =
        await this.subCategoryManagementModel.countDocuments(filter);
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
        'An error occurred while fetching sub categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteSubCategory(
    id: string,
  ): Promise<SubCategoryManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);

      const deleteSubCategory =
        await this.subCategoryManagementModel.findOneAndDelete({
          _id: objectId,
        });
      return deleteSubCategory as SubCategoryManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching sub categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
