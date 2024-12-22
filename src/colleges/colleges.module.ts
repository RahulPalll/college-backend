import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegesController } from './colleges.controller';
import { CollegesService } from './colleges.service';
import { College } from '../entities/college.entity';
import { CollegePlacement } from '../entities/college-placement.entity';
import { CollegeWiseCourse } from '../entities/college-wise-course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([College, CollegePlacement, CollegeWiseCourse]),
  ],
  controllers: [CollegesController],
  providers: [CollegesService],
  exports: [TypeOrmModule],
})
export class CollegesModule {}
