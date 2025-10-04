import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role.entity';
import { CarAd } from './car-ad.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 'base' })
  accountType: 'base' | 'premium' | 'internal';

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  avatarKey: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  imageKey: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => CarAd, (ad) => ad.seller)
  ads: CarAd[];

  @Column({ type: 'varchar', nullable: true })
  hashedRefreshToken?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
