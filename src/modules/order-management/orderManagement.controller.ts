import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ListOrderDto,
  OrderMngDto,
  QueryOrderDto,
} from './dto/orderManagement.dto';
import { OrderManagementModel } from './models/orderManagement.model';
import { OrderManagerService } from './orderManagement.service';

@ApiTags('OrderManagement')
@Controller('order')
export class OrderManagementController {
  constructor(private readonly orderManagementService: OrderManagerService) {}

  @Post()
  async create(@Body() body: OrderMngDto): Promise<OrderManagementModel> {
    return await this.orderManagementService.createOrder(body);
  }

  @Get('list')
  async getAllOrder(@Query() query: QueryOrderDto): Promise<ListOrderDto> {
    return await this.orderManagementService.getAllOrder(query);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrderManagementModel> {
    return await this.orderManagementService.getOrderById(id);
  }
}
