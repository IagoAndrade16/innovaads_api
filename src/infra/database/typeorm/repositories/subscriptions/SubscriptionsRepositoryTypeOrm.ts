
import { Subscription } from "../../../../../domain/modules/subscriptions/entities/Subscription";
import { InsertSubscritionInput, SubscriptionsRepository } from "../../../../../domain/modules/subscriptions/repositories/SubscriptionsRepository";
import { Database } from "../../../Database";



export class SubscriptionsRepositoryTypeOrm implements SubscriptionsRepository {
  private repository = Database.source.getRepository(Subscription);

  async insert(data: InsertSubscritionInput): Promise<Subscription> {
    const subscription = this.repository.create({
      ...data,
    });

    await this.repository.save(subscription);

    return subscription;
  }
}