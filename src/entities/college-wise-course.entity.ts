import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { College } from './college.entity';

@Entity('college_wise_courses')
export class CollegeWiseCourse {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => College, (college) => college.courses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'college_id' })
  college: College;

  @Column()
  course_name: string;

  @Column()
  course_duration: number;

  @Column()
  course_fee: number;
}
