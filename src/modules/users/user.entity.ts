import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({
    select: false
  })
  password?: string;

  @Column({
    nullable: true
  })
  otp: number;

  @Column({
    nullable: true
  })
  refresh_token?: string;
}
