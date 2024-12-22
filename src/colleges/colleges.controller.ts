import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CollegesService } from './colleges.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('colleges')
@UseGuards(JwtAuthGuard)
@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @ApiOperation({ summary: 'Get placement data for a college' })
  @ApiParam({ name: 'collegeId', description: 'ID of the college' })
  @Get('college_data/:collegeId')
  async getCollegePlacementData(@Param('collegeId') collegeId: number) {
    return this.collegesService.getCollegePlacementData(collegeId);
  }

  @ApiOperation({ summary: 'Get courses offered by a college' })
  @ApiParam({ name: 'collegeId', description: 'ID of the college' })
  @Get('college_courses/:collegeId')
  async getCollegeCourses(@Param('collegeId') collegeId: number) {
    return this.collegesService.getCollegeCourses(collegeId);
  }

  @ApiOperation({ summary: 'Get colleges by city or state' })
  @ApiQuery({ name: 'city', required: false, description: 'City name' })
  @ApiQuery({ name: 'state', required: false, description: 'State name' })
  @Get()
  async getCollegesByFilter(
    @Query('city') city?: string,
    @Query('state') state?: string,
  ) {
    return this.collegesService.getCollegesByFilter(city, state);
  }
}
