import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderLinhKienService } from './orderLinhKien.service';
import {
  CreateOrderLinhKienDto,
  UpdateOrderLinhKienDto,
  OrderLinhKienResponseDto,
  QueryOrderLinhKienDto,
  OrderLinhKienListResponseDto,
} from './dto/orderLinhKien.dto';

@ApiTags('order-linh-kien')
@Controller('order-linh-kien')
export class OrderLinhKienController {
  constructor(private readonly orderLinhKienService: OrderLinhKienService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo mới đơn hàng linh kiện' })
  @ApiResponse({
    status: 201,
    description: 'Đơn hàng đã được tạo thành công',
    type: OrderLinhKienResponseDto,
  })
  create(@Body() createOrderLinhKienDto: CreateOrderLinhKienDto) {
    return this.orderLinhKienService.create(createOrderLinhKienDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng linh kiện' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đơn hàng linh kiện',
    type: OrderLinhKienListResponseDto,
  })
  findAll(@Query() query: QueryOrderLinhKienDto) {
    return this.orderLinhKienService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một đơn hàng linh kiện theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin đơn hàng linh kiện',
    type: OrderLinhKienResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.orderLinhKienService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin đơn hàng linh kiện' })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được cập nhật thành công',
    type: OrderLinhKienResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderLinhKienDto: UpdateOrderLinhKienDto,
  ) {
    return this.orderLinhKienService.update(id, updateOrderLinhKienDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một đơn hàng linh kiện' })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được xóa thành công',
    type: OrderLinhKienResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.orderLinhKienService.remove(id);
  }
}
