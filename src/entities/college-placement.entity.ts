import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { College } from './college.entity';

@Entity('college_placements')
export class CollegePlacement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => College, (college) => college.placements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'college_id' })
  college: College;

  @Column()
  year: number;

  @Column()
  highest_placement: number;

  @Column()
  average_placement: number;

  @Column()
  median_placement: number;

  @Column()
  placement_rate: number;
}
