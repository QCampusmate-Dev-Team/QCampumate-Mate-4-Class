import { Controller, Body, Param, UseGuards, Get, Post, Patch, Delete } from '@nestjs/common';

@Controller('degree-requirement')
export class DegreeRequirementController {
  @Delete('/id')
  delete(@Param('id') id: number) {

  }
}
