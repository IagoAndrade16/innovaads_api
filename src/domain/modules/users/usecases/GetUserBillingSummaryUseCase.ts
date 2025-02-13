import { inject, singleton } from "tsyringe";
import { DomainDates } from "../../../../core/DomainDates";
import { UseCase } from "../../../../core/UseCase";
import { PagarmeProvider, pagarmeProviderAlias } from "../../../../providers/pagarme/PagarmeProvider";
import { DomainError } from "../../../errors/DomainError";
import { UserNotFoundError } from "../../../errors/UserNotFoundError";
import { PackageDetails } from "../../packages/entities/PackageDetails";
import { PackagesRepository, packagesRepositoryAlias } from "../../packages/repositories/PackagesRepository";
import { UserSubscriptionStatus } from "../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../repositories/UsersRepository";

export type GetUserBillingSummaryUseCaseInput = {
  userId: string;
}

export type GetUserBillingSummaryUseCaseOutput = {
  package: {
    id: string;
    name: string;
    price: number;
    description: string;
    details: PackageDetails[];
  } | null,
  subscription: {
    nextBillingAt: string;
    status: UserSubscriptionStatus;
    card: {
      brand: string;
      lastFourDigits: string;
      firstSixDigits: string;
    }
  } | null;
}

@singleton()
export class GetUserBillingSummaryUseCase implements UseCase<GetUserBillingSummaryUseCaseInput, GetUserBillingSummaryUseCaseOutput> {
  constructor (
    @inject(usersRepositoryAlias)
    private readonly usersRepository: UsersRepository,

    @inject(packagesRepositoryAlias)
    private readonly packagesRepository: PackagesRepository,

    @inject(pagarmeProviderAlias)
    private readonly pagarmeProvider: PagarmeProvider,
  ) {}

  async execute(input: GetUserBillingSummaryUseCaseInput): Promise<GetUserBillingSummaryUseCaseOutput> {
    const user = await this.usersRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if(!user.packageId || !user.subscriptionId) {
      throw new DomainError(400, 'USER_HAS_NO_PACKAGE');
    }

    const response: GetUserBillingSummaryUseCaseOutput = {
      package: null,
      subscription: null
    };

    const [packageInfo, subscription] = await Promise.all([
      this.packagesRepository.findByIdWithDetails(user.packageId),
      this.pagarmeProvider.getSubscription(user.subscriptionId ?? ''),
    ]);

    if(packageInfo) {
      response.package = {
        name: packageInfo.name,
        price: packageInfo.price,
        description: packageInfo.description,
        details: packageInfo.details,
        id: packageInfo.id
      };
    }

    if(subscription) {
      response.subscription = {
        nextBillingAt: DomainDates.format(subscription.next_billing_at, 'DD/MM/YYYY'),
        status: subscription.status,
        card: {
          brand: subscription.card.brand,
          lastFourDigits: subscription.card.last_four_digits,
          firstSixDigits: subscription.card.first_six_digits
        }
      };
    }

    return response;
  }
}