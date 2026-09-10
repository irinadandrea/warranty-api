import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { WarrantyService } from './warranty.service';

type AuthenticatedRequest = Request & {
  user: { sub: string };
};

@Controller('warranties')
@UseGuards(JwtAuthGuard)
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createWarrantyDto: CreateWarrantyDto,
  ) {
    return this.warrantyService.create(request.user.sub, createWarrantyDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.warrantyService.findAll(request.user.sub);
  }

  @Get(':id')
  findOne(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.warrantyService.findOne(request.user.sub, id);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateWarrantyDto: UpdateWarrantyDto,
  ) {
    return this.warrantyService.update(
      request.user.sub,
      id,
      updateWarrantyDto,
    );
  }

  @Delete('expired/cleanup')
  cleanupExpired(@Req() request: AuthenticatedRequest) {
    return this.warrantyService.cleanupExpired(request.user.sub);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.warrantyService.remove(request.user.sub, id);
  }
}