import moment from "moment";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { find } from "../../../../core/DependencyInjection";
import { JwtProvider, jwtProviderAlias } from "../../../../providers/jwt/JwtProvider";


export type UserRole = 'user' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    default: null,
  })
  packageId: string | null;

  @Column({ type: 'varchar', length: 255, default: 'user' })
  role: UserRole;

  @Column({ type: 'boolean', default: false, nullable: false })
  verified2fa: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  subscriptionId: string | null;

  get isOnTrial(): boolean {
    return moment(this.createdAt).add(7, 'days').isAfter(moment());
  }

  get daysRemainingForTrial(): number {
    if(!this.isOnTrial) {
      return 0;
    }

    return moment(this.createdAt).add(7, 'days').diff(moment(), 'days');
  }

  get needsToBuyPlan(): boolean {
    if(this.role === 'admin') return false;
    
    return !this.packageId && (this.daysRemainingForTrial <= 0 || !this.isOnTrial)
  }

  static async generateUserToken(input: {
    id: string;
  }): Promise<string> {
    const jwtProvider = find<JwtProvider>(jwtProviderAlias);

    return jwtProvider.sign({ id: input.id });
  }
}