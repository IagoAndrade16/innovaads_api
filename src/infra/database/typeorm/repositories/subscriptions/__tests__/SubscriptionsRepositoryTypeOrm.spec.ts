import { find } from "../../../../../../core/DependencyInjection";
import { SubscriptionsRepository, subscriptionsRepositoryAlias } from "../../../../../../domain/modules/subscriptions/repositories/SubscriptionsRepository";
import { Database } from "../../../../Database";

const repository = find<SubscriptionsRepository>(subscriptionsRepositoryAlias);

beforeAll(async () => {
  await Database.initialize();
})

afterAll(async () => {
  await Database.close();
})

describe('insert', () => {
  it('should insert a new subscription', async () => {
    const subscription = await repository.insert({
      packageId: '1',
      subscriptionId: '1',
      userId: '1',
    });

    await Database.source.getRepository('Subscription').delete(subscription.id);

    expect(subscription).toBeDefined();
  })
})