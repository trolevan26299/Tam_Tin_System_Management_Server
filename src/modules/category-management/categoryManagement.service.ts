import { MongooseModel } from '@app/interfaces/mongoose.interface';
import { InjectModel } from '@app/transformers/model.transformer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  CategoryMngDTO,
  DetailCategoryDto,
  ListCategoryDto,
  QueryCategoryDto,
} from './dto/categoryManagement.dto';
import { CategoryManagementModel } from './models/categoryManagement.model';

@Injectable()
export class CategoryManagerService {
  constructor(
    @InjectModel(CategoryManagementModel)
    private readonly categoryManagementModel: MongooseModel<CategoryManagementModel>,
  ) {}

  public async getAllCategory(
    query: QueryCategoryDto,
  ): Promise<ListCategoryDto> {
    try {
      const page = Number(query.page) + 1 || 1;
      const items_per_page = Number(query.items_per_page) || 10;
      const keyword = query.keyword || '';

      const skip = (page - 1) * items_per_page;
      const filter: any = {};

      if (keyword) {
        filter.$or = [{ name: { $regex: keyword, $options: 'i' } }];
      }

      const dataRes = await this.categoryManagementModel
        .find(filter)
        .limit(items_per_page)
        .skip(skip)
        .exec();

      const totalCount =
        await this.categoryManagementModel.countDocuments(filter);
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
        'An error occurred while fetching categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getDetailCategory(id: string): Promise<DetailCategoryDto> {
    try {
      const category = await this.categoryManagementModel.findById(id).exec();
      if (!category) {
        throw new HttpException('Category not exists !', HttpStatus.NOT_FOUND);
      }
      return { data: category };
    } catch (error) {
      throw new HttpException(
        'An error occurred while fetching the category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createCategory(
    body: CategoryMngDTO,
  ): Promise<CategoryManagementModel> {
    const { name } = body;
    const duplicateNameCategory = await this.categoryManagementModel.findOne({
      name,
    });

    if (duplicateNameCategory) {
      throw new HttpException('Category already exists!', HttpStatus.CONFLICT);
    }

    const newCategory = new this.categoryManagementModel(body);
    return newCategory.save();
  }

  public async updateCategory(
    id: string,
    body: CategoryMngDTO,
  ): Promise<CategoryManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);
      const newCategory = await this.categoryManagementModel.findOneAndUpdate(
        { _id: objectId },
        body,
        { new: true },
      );

      return newCategory as CategoryManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while updating the category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteCategory(id: string): Promise<CategoryManagementModel> {
    try {
      const objectId = new Types.ObjectId(id);
      const deleteCategory =
        await this.categoryManagementModel.findOneAndDelete({
          _id: objectId,
        });
      return deleteCategory as CategoryManagementModel;
    } catch (error) {
      throw new HttpException(
        'An error occurred while delete the category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
