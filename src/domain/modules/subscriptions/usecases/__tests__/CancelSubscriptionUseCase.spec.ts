import { find } from "../../../../../core/DependencyInjection";
import { PagarmeProvider, pagarmeProviderAlias } from "../../../../../providers/pagarme/PagarmeProvider";
import { DomainError } from "../../../../errors/DomainError";
import { ResourceNotFoundError } from "../../../../errors/ResourceNotFoundError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../../users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../users/repositories/UsersRepository";
import { SubscriptionsRepository, subscriptionsRepositoryAlias } from "../../repositories/SubscriptionsRepository";
import { CancelSubscriptionUseCase } from "../CancelSubscriptionUseCase";

const usecase = find(CancelSubscriptionUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);
const pagarmeProvider = find<PagarmeProvider>(pagarmeProviderAlias);
const subscriptionsRepo = find<SubscriptionsRepository>(subscriptionsRepositoryAlias);

it('should throw error if user not found', async () => {
  const userId = '1';
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce(null);

  await expect(usecase.execute({ userId })).rejects.toEqual(new UserNotFoundError());


  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);
});

it('should throw error if user has no subscription', async () => {
  const userId = '1';
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce({ id: userId, subscriptionId: null } as User);

  await expect(usecase.execute({ userId })).rejects.toEqual(new ResourceNotFoundError('SUBSCRIPTION_NOT_FOUND'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);
});

it('should throw error if fail to cancel subscription', async () => {
  const userId = '1';
  const subscriptionId = '2';
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce({ id: userId, subscriptionId } as User);
  jest.spyOn(pagarmeProvider, 'deleteSubscription').mockResolvedValueOnce({ status: 'FAILED' });

  await expect(usecase.execute({ userId })).rejects.toEqual(new DomainError(400, 'FAIL_TO_CANCEL_SUBSCRIPTION'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(pagarmeProvider.deleteSubscription).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.deleteSubscription).toHaveBeenCalledWith(subscriptionId);
});

it('should cancel subscription', async () => {
  const userId = '1';
  const subscriptionId = '2';
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce({ id: userId, subscriptionId } as User);
  jest.spyOn(pagarmeProvider, 'deleteSubscription').mockResolvedValueOnce({ status: 'SUCCESS' });
  jest.spyOn(subscriptionsRepo, 'delete').mockResolvedValueOnce();
  jest.spyOn(usersRepo, 'updateById').mockResolvedValueOnce();

  await usecase.execute({ userId });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(userId);

  expect(pagarmeProvider.deleteSubscription).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.deleteSubscription).toHaveBeenCalledWith(subscriptionId);

  expect(subscriptionsRepo.delete).toHaveBeenCalledTimes(1);
  expect(subscriptionsRepo.delete).toHaveBeenCalledWith(subscriptionId);

  expect(usersRepo.updateById).toHaveBeenCalledTimes(1);
  expect(usersRepo.updateById).toHaveBeenCalledWith(userId, { subscriptionStatus: 'canceled' });
});