import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { AndarService } from '../services/andar.service';
import { CreateAndarDto, UpdateAndarDto } from '../entities/dto/andar.dto';

@Controller('andares')
export class AndarController {
  constructor(private readonly andarService: AndarService) {}

  @Post()
  create(@Body() createAndarDto: CreateAndarDto) {
    return this.andarService.create(createAndarDto);
  }

  @Get()
  findAll(
    @Query('pagination[page]') page?: string,
    @Query('pagination[pageSize]') pageSize?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize) : 10000;
    return this.andarService.findAll(pageNum, pageSizeNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.andarService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAndarDto: UpdateAndarDto) {
    return this.andarService.update(id, updateAndarDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.andarService.remove(id);
  }
}
