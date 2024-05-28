import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerManagerService } from './customerManagement.service';
import {
  CustomerMngDTO,
  ListCustomerDto,
  QueryCustomerDto,
} from './dto/customerManagement.dto';
import { CustomerManagementModel } from './models/customerManagement.model';

@ApiTags('CustomerManagement')
@Controller('customer')
export class CustomerManagementController {
  constructor(
    private readonly customerManagementService: CustomerManagerService,
  ) {}

  @Get('list')
  async getAllCustomer(
    @Query() query: QueryCustomerDto,
  ): Promise<ListCustomerDto> {
    return this.customerManagementService.getAllCustomer(query);
  }

  @Post()
  async create(@Body() body: CustomerMngDTO): Promise<CustomerManagementModel> {
    return await this.customerManagementService.createCustomer(body);
  }

  @Get(':id')
  async getCustomerById(
    @Param('id') id: string,
  ): Promise<CustomerManagementModel> {
    return await this.customerManagementService.getCustomerById(id);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: CustomerMngDTO,
  ): Promise<CustomerManagementModel> {
    return await this.customerManagementService.updateCustomerById(id, body);
  }

  @Delete(':id')
  async deleteCustomer(
    @Param('id') id: string,
  ): Promise<CustomerManagementModel> {
    return await this.customerManagementService.deleteCustomerById(id);
  }
}
