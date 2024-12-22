import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';
import { State } from './state.entity';
import { CollegePlacement } from './college-placement.entity';
import { CollegeWiseCourse } from './college-wise-course.entity';

@Entity('colleges')
export class College {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  score: number;

  @ManyToOne(() => City, (city) => city.colleges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ManyToOne(() => State, (state) => state.colleges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state: State;

  @OneToMany(() => CollegePlacement, (placement) => placement.college)
  placements: CollegePlacement[];

  @OneToMany(() => CollegeWiseCourse, (course) => course.college)
  courses: CollegeWiseCourse[];
}
