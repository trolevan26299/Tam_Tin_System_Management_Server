import { ApiProperty } from '@nestjs/swagger';

export class QueryAnalyTicsDto {
  @ApiProperty({ required: false })
  from_date: string;
  @ApiProperty({ required: false })
  to_date: string;
}

export class AnalyTicsDto {
  orderCount?: number;
  revenue?: number;
  profit?: number;
  newCustomerCount?: number;
}

export class ListAnalyTicsDto {
  data: AnalyTicsDto;
}
