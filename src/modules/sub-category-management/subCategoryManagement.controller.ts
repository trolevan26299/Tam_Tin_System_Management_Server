import { AuthGuard } from '@app/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  DetailSubCategoryDto,
  ListSubCategoryDto,
  QuerySubCategoryDto,
  SubCategoryDto,
} from './dto/subCategoryManagement.dto';
import { SubCategoryManagementModel } from './models/subCategoryManagement.model';
import { SubCategoryManagerService } from './subCategoryManagement.service';

@ApiBearerAuth()
@ApiTags('SubCategoryManagement')
@UseGuards(AuthGuard)
@Controller('sub-category')
export class SubCategoryManagerController {
  constructor(private readonly subCategoryService: SubCategoryManagerService) {}

  @Get('list')
  async getAllSubCategory(
    @Query() query: QuerySubCategoryDto,
  ): Promise<ListSubCategoryDto> {
    return await this.subCategoryService.getListSubCategory(query);
  }

  @Post()
  async createSubCategory(
    @Body() body: SubCategoryDto,
  ): Promise<SubCategoryManagementModel> {
    return await this.subCategoryService.createSubCategory(body);
  }

  @Get(':id')
  async getSubCategoryById(
    @Param('id') id: string,
  ): Promise<DetailSubCategoryDto> {
    return await this.subCategoryService.getCategoryById(id);
  }

  @Put(':id')
  async updateSubCategory(
    @Param('id') id: string,
    @Body() body: SubCategoryDto,
  ): Promise<SubCategoryManagementModel> {
    return await this.subCategoryService.updateSubCategory(id, body);
  }

  @Delete(':id')
  async deleteSubCategory(
    @Param('id') id: string,
  ): Promise<SubCategoryManagementModel> {
    return await this.subCategoryService.deleteSubCategory(id);
  }
}
