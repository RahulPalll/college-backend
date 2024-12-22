import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from '../entities/college.entity';
import { CollegePlacement } from '../entities/college-placement.entity';
import { CollegeWiseCourse } from '../entities/college-wise-course.entity';

@Injectable()
export class CollegesService {
  constructor(
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    @InjectRepository(CollegePlacement)
    private readonly placementRepository: Repository<CollegePlacement>,
    @InjectRepository(CollegeWiseCourse)
    private readonly courseRepository: Repository<CollegeWiseCourse>,
  ) {}

  // 1. Get Placement Data
  async getCollegePlacementData(collegeId: number) {
    // Avg Section
    const avgSection = await this.placementRepository
      .createQueryBuilder('placement')
      .select('placement.year', 'year')
      .addSelect('AVG(placement.highest_placement)', 'avg_highest_placement')
      .addSelect('AVG(placement.average_placement)', 'avg_average_placement')
      .addSelect('AVG(placement.median_placement)', 'avg_median_placement')
      .addSelect('AVG(placement.placement_rate)', 'avg_placement_rate')
      .where('placement.college_id = :collegeId', { collegeId })
      .andWhere('placement.highest_placement > 0')
      .andWhere('placement.average_placement > 0')
      .andWhere('placement.median_placement > 0')
      .andWhere('placement.placement_rate > 0')
      .groupBy('placement.year')
      .getRawMany();

    // Placement Section
    const placementSection = await this.placementRepository
      .createQueryBuilder('placement')
      .select(['placement.*'])
      .addSelect(
        `CASE
           WHEN placement.placement_rate > LAG(placement.placement_rate) OVER (PARTITION BY placement.college_id ORDER BY placement.year)
           THEN 'UP'
           ELSE 'DOWN'
         END`,
        'placement_trend',
      )
      .where('placement.college_id = :collegeId', { collegeId })
      .andWhere('placement.placement_rate > 0')
      .getRawMany();

    return { avg_section: avgSection, placement_section: placementSection };
  }

  // 2. Get College Courses
  async getCollegeCourses(collegeId: number) {
    return this.courseRepository.find({
      where: { college: { id: collegeId } },
      order: { course_fee: 'DESC' },
    });
  }

  // 3. Get Colleges by City or State
  async getCollegesByFilter(city?: string, state?: string) {
    const query = this.collegeRepository
      .createQueryBuilder('college')
      .leftJoinAndSelect('college.city', 'city')
      .leftJoinAndSelect('college.state', 'state');

    if (city) {
      query.andWhere('city.name = :city', { city });
    }

    if (state) {
      query.andWhere('state.name = :state', { state });
    }

    return query.getMany();
  }
}
