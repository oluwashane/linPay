import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeesService } from './fees.service';
import { CreateFeeDto, CreateFeeObjectDto } from './dto/create-fee.dto';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Post()
  async create(@Body() createFeeDto: CreateFeeDto) {
    return await this.feesService.create(createFeeDto);
  }

  @Get()
  findAll() {
    return this.feesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feesService.findOne(+id);
  }
}
