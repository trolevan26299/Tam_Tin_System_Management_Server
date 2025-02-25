import { AuthGuard } from '@app/guards/auth.guard';
// import { RolesGuard } from '@app/guards/roles.guard';
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
  ListOrderDto,
  OrderMngDto,
  QueryOrderDto,
} from './dto/orderManagement.dto';
import { OrderManagementModel } from './models/orderManagement.model';
import { OrderManagerService } from './orderManagement.service';

@ApiBearerAuth()
@ApiTags('OrderManagement')
@UseGuards(AuthGuard)
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

  // @UseGuards(RolesGuard)
  @Put(':id')
  async updateOrderById(
    @Param('id') id: string,
    @Body() body: OrderMngDto,
  ): Promise<OrderManagementModel | boolean> {
    return await this.orderManagementService.updateOrderById(id, body);
  }

  // @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteOrderById(@Param('id') id: string): Promise<boolean> {
    console.log('id', id);
    return await this.orderManagementService.deleteOrderById(id);
  }
}
