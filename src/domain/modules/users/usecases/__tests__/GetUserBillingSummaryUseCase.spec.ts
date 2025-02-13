import { find } from "../../../../../core/DependencyInjection";
import { DomainDates } from "../../../../../core/DomainDates";
import { PagarmeProvider, pagarmeProviderAlias } from "../../../../../providers/pagarme/PagarmeProvider";
import { GetSubscriptionOutput } from "../../../../../providers/pagarme/types/GetSubscriptionTypes";
import { DomainError } from "../../../../errors/DomainError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { Package } from "../../../packages/entities/Package";
import { PackagesRepository, packagesRepositoryAlias } from "../../../packages/repositories/PackagesRepository";
import { User } from "../../entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../repositories/UsersRepository";
import { GetUserBillingSummaryUseCase } from "../GetUserBillingSummaryUseCase";

const usecase = find(GetUserBillingSummaryUseCase);

const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const packagesRepository = find<PackagesRepository>(packagesRepositoryAlias);
const pagarmeProvider = find<PagarmeProvider>(pagarmeProviderAlias);

it('should throw error if user not found', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({ userId: '1' })).rejects.toEqual(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');
})

it('should throw error if user has no package', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ packageId: null } as User);

  await expect(usecase.execute({ userId: '1' })).rejects.toEqual(new DomainError(400, 'USER_HAS_NO_PACKAGE'));

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');
});

it('should return user billing summary', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ 
    packageId: '1',
    subscriptionId: '1'
  } as User);
  jest.spyOn(packagesRepository, 'findByIdWithDetails').mockResolvedValue({
    id: '1',
  } as Package);
  jest.spyOn(pagarmeProvider, 'getSubscription').mockResolvedValue({
    next_billing_at: new Date(),
    status: 'active',
    card: {
      last_four_digits: '1234',
      first_six_digits: '123456',
      brand: 'visa'
    }
  } as GetSubscriptionOutput);

  const result = await usecase.execute({ userId: '1' });

  expect(result).toEqual({
    package: {
      id: '1',
    },
    subscription: {
      nextBillingAt: DomainDates.format(new Date(), 'DD/MM/YYYY'),
      status: 'active',
      card: {
        brand: 'visa',
        lastFourDigits: '1234',
        firstSixDigits: '123456'
      }
    }
  });

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');

  expect(packagesRepository.findByIdWithDetails).toHaveBeenCalledTimes(1);
  expect(packagesRepository.findByIdWithDetails).toHaveBeenCalledWith('1');

  expect(pagarmeProvider.getSubscription).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.getSubscription).toHaveBeenCalledWith('1');
});