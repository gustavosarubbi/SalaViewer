import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AndarService } from '../services/andar.service';
import { CreateAndarDto, UpdateAndarDto } from '../entities/dto/andar.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('andares')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AndarController {
  constructor(private readonly andarService: AndarService) {}

  @Post()
  @Roles('admin')
  create(@Body() createAndarDto: CreateAndarDto) {
    return this.andarService.create(createAndarDto);
  }

  @Get()
  @Roles('admin')
  findAll(
    @Query('pagination[page]') page?: string,
    @Query('pagination[pageSize]') pageSize?: string,
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const pageSizeNum = pageSize ? parseInt(pageSize) : 10000;
    return this.andarService.findAll(pageNum, pageSizeNum);
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.andarService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAndarDto: UpdateAndarDto) {
    return this.andarService.update(id, updateAndarDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.andarService.remove(id);
  }
}
