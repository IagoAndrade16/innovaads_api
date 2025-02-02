import { Subscription } from "../entities/Subscription";

export type SubscriptionsRepository = {
  insert(input: InsertSubscritionInput): Promise<Subscription>;
}

export type InsertSubscritionInput = {
  packageId: string;
  subscriptionId: string;
  userId: string;
}

export const subscriptionsRepositoryAlias = 'SubscriptionsRepository'