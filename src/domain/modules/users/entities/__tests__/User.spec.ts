import moment from "moment";
import { User } from "../User";
import { find } from "../../../../../core/DependencyInjection";
import { PagarmeProvider, pagarmeProviderAlias } from "../../../../../providers/pagarme/PagarmeProvider";
import { GetSubscriptionOutput } from "../../../../../providers/pagarme/types/GetSubscriptionTypes";

const pagarmeProvider = find<PagarmeProvider>(pagarmeProviderAlias);

describe('needsToBuyPlan', () => {
  it('should return true if subscriptionStatus is active', async () => {
    const user = new User();
    user.subscriptionStatus = 'active';
    expect(await user.needsToBuyPlan()).toBe(false);
  });

  it('should return true if subscriptionStatus is canceled and canUsePlatformUntil is not expired', async () => {
    const user = new User();
    user.subscriptionStatus = 'canceled';
    jest.spyOn(user, 'canUsePlatformUntil').mockResolvedValue(moment().add(1, 'days').toDate());
    expect(await user.needsToBuyPlan()).toBe(false);
  });

  it('should return false if subscriptionStatus is canceled and canUsePlatformUntil is expired', async () => {
    const user = new User();
    user.subscriptionStatus = 'canceled';
    jest.spyOn(user, 'canUsePlatformUntil').mockResolvedValue(new Date('2021-01-01'));
    expect(await user.needsToBuyPlan()).toBe(true);
  });

  it('should return true if subscriptionStatus is not defined and daysRemainingForTrial is greater than 0', async () => {
    const user = new User();
    jest.spyOn(user, 'daysRemainingForTrial', 'get').mockReturnValue(1);
    expect(await user.needsToBuyPlan()).toBe(false);
  });

  it('should return false if subscriptionStatus is not defined and daysRemainingForTrial is equal to 0', async () => {
    const user = new User();
    jest.spyOn(user, 'daysRemainingForTrial', 'get').mockReturnValue(0);
    expect(await user.needsToBuyPlan()).toBe(true);
  });

  it('should return false if subscriptionStatus is not defined and daysRemainingForTrial is less than 0', async () => {
    const user = new User();
    jest.spyOn(user, 'daysRemainingForTrial', 'get').mockReturnValue(-1);
    expect(await user.needsToBuyPlan()).toBe(true);
  });
});

describe('canUsePlatformUntil', () => {
  it('should return a date 7 days after createdAt', async() => {
    const user = new User();
    user.subscriptionId = null;

    const res = await user.canUsePlatformUntil();

    expect(res).toBeNull();;
  });

  it('should return a next billing date from pagarme', async () => {
    const user = new User();
    user.subscriptionId = '123';

    jest.spyOn(pagarmeProvider, 'getSubscription').mockResolvedValue({
      next_billing_at: new Date('2021-01-01')
    } as GetSubscriptionOutput);

    const res = await user.canUsePlatformUntil();

    expect(res).toEqual(new Date('2021-01-01'));
  })
})