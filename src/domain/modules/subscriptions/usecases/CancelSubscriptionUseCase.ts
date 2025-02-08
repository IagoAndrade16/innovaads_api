import { inject, singleton } from 'tsyringe';

import { UseCase } from '../../../../core/UseCase';
import { PagarmeProvider, pagarmeProviderAlias } from '../../../../providers/pagarme/PagarmeProvider';
import { DomainError } from '../../../errors/DomainError';
import { ResourceNotFoundError } from '../../../errors/ResourceNotFoundError';
import { UserNotFoundError } from '../../../errors/UserNotFoundError';
import { UsersRepository, usersRepositoryAlias } from '../../users/repositories/UsersRepository';
import { SubscriptionsRepository, subscriptionsRepositoryAlias } from '../repositories/SubscriptionsRepository';

export type CancelSubscriptionUseCaseInput = {
	userId: string;
};

export type CancelSubscriptionUseCaseOutput = void;

@singleton()
export class CancelSubscriptionUseCase implements UseCase<CancelSubscriptionUseCaseInput, CancelSubscriptionUseCaseOutput> {
	constructor(
		@inject(usersRepositoryAlias)
		private readonly usersRepository: UsersRepository,

		@inject(pagarmeProviderAlias)
		private readonly pagarmeProvider: PagarmeProvider,

		@inject(subscriptionsRepositoryAlias)
		private readonly subscriptionsRepository: SubscriptionsRepository,
	) {}

	async execute(input: CancelSubscriptionUseCaseInput): Promise<CancelSubscriptionUseCaseOutput> {
		const user = await this.usersRepository.findById(input.userId);

		if (!user) {
			throw new UserNotFoundError();
		}

		if(!user.subscriptionId) {
      throw new ResourceNotFoundError('SUBSCRIPTION_NOT_FOUND');
    }

    const cancelSubscriptionRes = await this.pagarmeProvider.deleteSubscription(user.subscriptionId);

    if(cancelSubscriptionRes.status === 'FAILED') {
      throw new DomainError(400, 'FAIL_TO_CANCEL_SUBSCRIPTION');
    }

    await Promise.all([
      this.subscriptionsRepository.delete(user.subscriptionId),
			this.usersRepository.updateById(user.id, {
				subscriptionStatus: 'canceled',
			}),
    ])
	}
}
