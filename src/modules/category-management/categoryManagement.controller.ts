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
import { CategoryManagerService } from './categoryManagement.service';
import {
  CategoryMngDTO,
  DetailCategoryDto,
  ListCategoryDto,
  QueryCategoryDto,
} from './dto/categoryManagement.dto';
import { CategoryManagementModel } from './models/categoryManagement.model';

@ApiBearerAuth()
@ApiTags('CategoryManagement')
@UseGuards(AuthGuard)
@Controller('category')
export class CategoryManagerController {
  constructor(private readonly categoryService: CategoryManagerService) {}

  @Get('list')
  async getAllCategory(
    @Query() query: QueryCategoryDto,
  ): Promise<ListCategoryDto> {
    return await this.categoryService.getAllCategory(query);
  }

  @Get(':id')
  async getDetailCategory(@Param('id') id: string): Promise<DetailCategoryDto> {
    return await this.categoryService.getDetailCategory(id);
  }

  @Post()
  async create(@Body() body: CategoryMngDTO): Promise<CategoryManagementModel> {
    return await this.categoryService.createCategory(body);
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: CategoryMngDTO,
  ): Promise<CategoryManagementModel> {
    return await this.categoryService.updateCategory(id, body);
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
  ): Promise<CategoryManagementModel> {
    return await this.categoryService.deleteCategory(id);
  }
}
