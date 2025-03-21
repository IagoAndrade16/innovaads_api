import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users_forgot_password_2fa')
export class UserForgotPassword2FA {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  code: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  alreadyUsed: boolean;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: 'now()', onUpdate: 'now()' })
  updatedAt: Date;
}