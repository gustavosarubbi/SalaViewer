import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SalaService } from '../services/sala.service';
import { CreateSalaDto, UpdateSalaDto } from '../entities/dto/sala.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('salas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  @Roles('admin')
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salaService.create(createSalaDto);
  }

  @Get()
  @Roles('admin')
  findAll(
    @Query('pagination[page]') page?: string,
    @Query('pagination[pageSize]') pageSize?: string,
    @Query('populate') populate?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize) : 10000;
    return this.salaService.findAll(pageNum, pageSizeNum);
  }

  @Get(':id')
  @Roles('admin')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('populate') populate?: string,
  ) {
    return this.salaService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salaService.update(id, updateSalaDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.remove(id);
  }
}
