import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SalaService } from '../services/sala.service';
import { CreateSalaDto, UpdateSalaDto } from '../entities/dto/sala.dto';

@Controller('salas')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  create(@Body() createSalaDto: CreateSalaDto) {
    return this.salaService.create(createSalaDto);
  }

  @Get()
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
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('populate') populate?: string,
  ) {
    return this.salaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSalaDto: UpdateSalaDto) {
    return this.salaService.update(id, updateSalaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salaService.remove(id);
  }
}
