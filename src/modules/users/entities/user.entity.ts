import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/enums/role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @IsEmail()
  email: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  @IsNotEmpty()
  password: string;

  @Column()
  isAdmin: boolean;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @Transform(({ value }) => value.name)
  role: Role;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
