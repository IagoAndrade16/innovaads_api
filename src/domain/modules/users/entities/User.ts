import moment from "moment";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { find } from "../../../../core/DependencyInjection";
import { JwtProvider, jwtProviderAlias } from "../../../../providers/jwt/JwtProvider";
import { PagarmeProvider, pagarmeProviderAlias } from "../../../../providers/pagarme/PagarmeProvider";
import { MomentUtils } from "../../../../core/MomentUtils";
import { FacebookCredential } from "./FacebookCredential";


export type UserRole = 'user' | 'admin';
export type UserSubscriptionStatus = 'active' | 'canceled' | 'failed';

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

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  subscriptionStatus: UserSubscriptionStatus | null;

  @OneToMany(() => FacebookCredential, facebookCredential => facebookCredential.user)
  facebookCredentials: FacebookCredential[];

  get isOnTrial(): boolean {
    return moment(this.createdAt).add(7, 'days').isAfter(moment());
  }

  get daysRemainingForTrial(): number {
    if(!this.isOnTrial) {
      return 0;
    }

    return moment(this.createdAt).add(7, 'days').diff(moment(), 'days');
  }

  async needsToBuyPlan(): Promise<boolean> {
		if(this.subscriptionStatus === 'active') return true;

		if(this.subscriptionStatus === 'canceled') {
			const nowFormatted = MomentUtils.formatDate(new Date(), 'YYYY-MM-DD');
      const canUsePlatformUntil = await this.canUsePlatformUntil();
			const canUsePlatformUntilFormatted = MomentUtils.formatDate(canUsePlatformUntil, 'YYYY-MM-DD');
			if(canUsePlatformUntilFormatted > nowFormatted) return true;
			return false;
		}


		if(!this.subscriptionStatus) {
			if(this.daysRemainingForTrial > 0) return true;
			return false;
		}

		return false;
  }

  public async canUsePlatformUntil(): Promise<Date | null> {
    if(!this.subscriptionId) return null;

    const pagarmeProvider = find<PagarmeProvider>(pagarmeProviderAlias);

    const subscription = await pagarmeProvider.getSubscription(this.subscriptionId);
    
    return subscription?.next_billing_at || null;
  }

  static async generateUserToken(input: { id: string }): Promise<string> {
    const jwtProvider = find<JwtProvider>(jwtProviderAlias);

    return jwtProvider.sign({ id: input.id });
  }
}