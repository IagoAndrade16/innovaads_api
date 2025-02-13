import { TestUtils } from "../../../../../../tests/utils/TestUtils";
import { find } from "../../../../../core/DependencyInjection";
import { PagarmeProvider, pagarmeProviderAlias } from "../../../../../providers/pagarme/PagarmeProvider";
import { DomainError } from "../../../../errors/DomainError";
import { ResourceNotFoundError } from "../../../../errors/ResourceNotFoundError";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { Package } from "../../../packages/entities/Package";
import { PackagesRepository, packagesRepositoryAlias } from "../../../packages/repositories/PackagesRepository";
import { User } from "../../../users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../users/repositories/UsersRepository";
import { Subscription } from "../../entities/Subscription";
import { SubscriptionsRepository, subscriptionsRepositoryAlias } from "../../repositories/SubscriptionsRepository";
import { SignPackageUseCase } from "../SignPackageUseCase";

const usecase = find(SignPackageUseCase);

const packagesRepo = find<PackagesRepository>(packagesRepositoryAlias);
const usersRepo = find<UsersRepository>(usersRepositoryAlias);
const pagarmeProvider = find<PagarmeProvider>(pagarmeProviderAlias);
const subscriptionsRepo = find<SubscriptionsRepository>(subscriptionsRepositoryAlias);

it('should throw user not found error', async () => {
  const input = {
    packageId: 'packageId',
    userId: 'userId',
    payerData: {
      document: 'document',
    },
    paymentData: {
      number: 'number',
      holderName: 'holderName',
      expMonth: 'expMonth',
      expYear: 'expYear',
      cvv: 'cvv',
      billingAddress: {
        zipCode: 'zipCode',
        street: 'street',
        number: 'number',
        neighborhood: 'neighborhood',
        city: 'city',
        state: 'state',
        country: 'country',
      },
    },
  };

  jest.spyOn(usersRepo, 'findById').mockResolvedValue(null);

  await expect(usecase.execute(input)).rejects.toEqual(new UserNotFoundError());

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('userId');
});

it('should throw error if package not found', async () => {
  const input = {
    packageId: 'packageId',
    userId: 'userId',
    payerData: {
      document: 'document',
    },
    paymentData: {
      number: 'number',
      holderName: 'holderName',
      expMonth: 'expMonth',
      expYear: 'expYear',
      cvv: 'cvv',
      billingAddress: {
        zipCode: 'zipCode',
        street: 'street',
        number: 'number',
        neighborhood: 'neighborhood',
        city: 'city',
        state: 'state',
        country: 'country',
      },
    },
  };

  jest.spyOn(usersRepo, 'findById').mockResolvedValue({} as User);
  jest.spyOn(packagesRepo, 'findById').mockResolvedValue(null);

  await expect(usecase.execute(input)).rejects.toEqual(new ResourceNotFoundError('PACKAGE_NOT_FOUND'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('userId');

  expect(packagesRepo.findById).toHaveBeenCalledTimes(1);
  expect(packagesRepo.findById).toHaveBeenCalledWith('packageId');
});

it('should throw error when create customer fails', async () => {
  const input = {
    packageId: 'packageId',
    userId: 'userId',
    payerData: {
      document: TestUtils.validCpf,
    },
    paymentData: {
      number: 'number',
      holderName: 'holderName',
      expMonth: 'expMonth',
      expYear: 'expYear',
      cvv: 'cvv',
      billingAddress: {
        zipCode: 'zipCode',
        street: 'street',
        number: 'number',
        neighborhood: 'neighborhood',
        city: 'city',
        state: 'state',
        country: 'country',
      },
    },
  };

  const mockedUser = {
    name: 'name',
    email: 'email',
    phone: '24998179466'
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(mockedUser);
  jest.spyOn(packagesRepo, 'findById').mockResolvedValue({} as Package);
  jest.spyOn(pagarmeProvider, 'createCustomer').mockResolvedValue(null);

  await expect(usecase.execute(input)).rejects.toEqual(new DomainError(400, 'INVALID_CUSTOMER'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('userId');

  expect(packagesRepo.findById).toHaveBeenCalledTimes(1);
  expect(packagesRepo.findById).toHaveBeenCalledWith('packageId');

  expect(pagarmeProvider.createCustomer).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCustomer).toHaveBeenCalledWith({
    type: 'individual',
    name: mockedUser.name,
    email: mockedUser.email,
    document: input.payerData.document,
    document_type: 'CPF',
    phones: {
      mobile_phone: {
        country_code: '55',
        area_code: '24',
        number: '998179466',
      },
    },
  });
})

it('should throw error when create card fails', async () => {
  const input = {
    packageId: 'packageId',
    userId: 'userId',
    payerData: {
      document: TestUtils.validCpf,
    },
    paymentData: {
      number: 'number',
      holderName: 'holderName',
      expMonth: 'expMonth',
      expYear: 'expYear',
      cvv: 'cvv',
      billingAddress: {
        zipCode: 'zipCode',
        street: 'street',
        number: 'number',
        neighborhood: 'neighborhood',
        city: 'city',
        state: 'state',
        country: 'country',
        complement: 'complement'
      },
    },
  };

  const mockedUser = {
    name: 'name',
    email: 'email',
    phone: '24998179466'
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(mockedUser);
  jest.spyOn(packagesRepo, 'findById').mockResolvedValue({} as Package);
  jest.spyOn(pagarmeProvider, 'createCustomer').mockResolvedValue({ id: 'customerId' });
  jest.spyOn(pagarmeProvider, 'createCard').mockResolvedValue(null);

  await expect(usecase.execute(input)).rejects.toEqual(new DomainError(400, 'INVALID_CARD'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('userId');

  expect(packagesRepo.findById).toHaveBeenCalledTimes(1);
  expect(packagesRepo.findById).toHaveBeenCalledWith('packageId');

  expect(pagarmeProvider.createCustomer).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCustomer).toHaveBeenCalledWith({
    type: 'individual',
    name: mockedUser.name,
    email: mockedUser.email,
    document: input.payerData.document,
    document_type: 'CPF',
    phones: {
      mobile_phone: {
        country_code: '55',
        area_code: '24',
        number: '998179466',
      },
    },
  });

  expect(pagarmeProvider.createCard).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCard).toHaveBeenCalledWith('customerId', {
    number: input.paymentData.number,
    holder_name: input.paymentData.holderName,
    exp_month: input.paymentData.expMonth,
    exp_year: input.paymentData.expYear,
    cvv: input.paymentData.cvv,
    billing_address: {
      country: input.paymentData.billingAddress.country,
      city: input.paymentData.billingAddress.city,
      state: input.paymentData.billingAddress.state,
      zip_code: input.paymentData.billingAddress.zipCode,
      street: input.paymentData.billingAddress.street,
      number: input.paymentData.billingAddress.number,
      neighborhood: input.paymentData.billingAddress.neighborhood,
      complement: input.paymentData.billingAddress.complement,
    },
  });
});

it('should throw error if create subscription fails', async () => {
  const input = {
    packageId: 'packageId',
    userId: 'userId',
    payerData: {
      document: TestUtils.validCpf,
    },
    paymentData: {
      number: 'number',
      holderName: 'holderName',
      expMonth: 'expMonth',
      expYear: 'expYear',
      cvv: 'cvv',
      billingAddress: {
        zipCode: 'zipCode',
        street: 'street',
        number: 'number',
        neighborhood: 'neighborhood',
        city: 'city',
        state: 'state',
        country: 'country',
        complement: 'complement'
      },
    },
  };

  const mockedUser = {
    id: 'userId',
    name: 'name',
    email: 'email',
    phone: '24998179466'
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(mockedUser);
  jest.spyOn(packagesRepo, 'findById').mockResolvedValue({
    name: 'package name',
    priceInCents: 1000,
    id: 'packageId',
  } as Package);
  jest.spyOn(pagarmeProvider, 'createCustomer').mockResolvedValue({ id: 'customerId' });
  jest.spyOn(pagarmeProvider, 'createCard').mockResolvedValue({ 
    id: 'cardId', 
    brand: 'brand',
    exp_month: 10,
    exp_year: 2024,
    lastFourDigits: 'lastFourDigits',
  });
  jest.spyOn(pagarmeProvider, 'createSubscription').mockResolvedValue({ 
    status: 'FAILED',
  });

  await expect(usecase.execute(input)).rejects.toEqual(new DomainError(400, 'PAYMENT_FAILED'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('userId');

  expect(packagesRepo.findById).toHaveBeenCalledTimes(1);
  expect(packagesRepo.findById).toHaveBeenCalledWith('packageId');

  expect(pagarmeProvider.createCustomer).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCustomer).toHaveBeenCalledWith({
    type: 'individual',
    name: mockedUser.name,
    email: mockedUser.email,
    document: input.payerData.document,
    document_type: 'CPF',
    phones: {
      mobile_phone: {
        country_code: '55',
        area_code: '24',
        number: '998179466',
      },
    },
  });

  expect(pagarmeProvider.createCard).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCard).toHaveBeenCalledWith('customerId', {
    number: input.paymentData.number,
    holder_name: input.paymentData.holderName,
    exp_month: input.paymentData.expMonth,
    exp_year: input.paymentData.expYear,
    cvv: input.paymentData.cvv,
    billing_address: {
      country: input.paymentData.billingAddress.country,
      city: input.paymentData.billingAddress.city,
      state: input.paymentData.billingAddress.state,
      zip_code: input.paymentData.billingAddress.zipCode,
      street: input.paymentData.billingAddress.street,
      number: input.paymentData.billingAddress.number,
      neighborhood: input.paymentData.billingAddress.neighborhood,
      complement: input.paymentData.billingAddress.complement,
    },
  });

  expect(pagarmeProvider.createSubscription).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createSubscription).toHaveBeenCalledWith({
    customer_id: 'customerId',
    description: 'package name',
    installments: 1,
    interval_count: 1,
    card_id: 'cardId',
    pricing_scheme: {
      price: 1000,
      scheme_type: 'unit',
      minimum_price: 1000,
    },
    minimum_price: 1000,
    quantity: 1,
  });
});

it('should sign package successfully', async () => {
  const input = {
    packageId: 'packageId',
    userId: 'userId',
    payerData: {
      document: TestUtils.validCpf,
    },
    paymentData: {
      number: 'number',
      holderName: 'holderName',
      expMonth: 'expMonth',
      expYear: 'expYear',
      cvv: 'cvv',
      billingAddress: {
        zipCode: 'zipCode',
        street: 'street',
        number: 'number',
        neighborhood: 'neighborhood',
        city: 'city',
        state: 'state',
        country: 'country',
        complement: 'complement'
      },
    },
  };

  const mockedUser = {
    id: 'userId',
    name: 'name',
    email: 'email',
    phone: '24998179466'
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValue(mockedUser);
  jest.spyOn(packagesRepo, 'findById').mockResolvedValue({
    name: 'package name',
    priceInCents: 1000,
    id: 'packageId',
  } as Package);
  jest.spyOn(pagarmeProvider, 'createCustomer').mockResolvedValue({ id: 'customerId' });
  jest.spyOn(pagarmeProvider, 'createCard').mockResolvedValue({ 
    id: 'cardId', 
    brand: 'brand',
    exp_month: 10,
    exp_year: 2024,
    lastFourDigits: 'lastFourDigits',
  });
  jest.spyOn(pagarmeProvider, 'createSubscription').mockResolvedValue({ 
    status: 'SUCCESS',
    subscription_id: 'subscriptionId',
   });

   jest.spyOn(usersRepo, 'updateById').mockResolvedValue();
   jest.spyOn(subscriptionsRepo, 'insert').mockResolvedValue({} as Subscription);

  await usecase.execute(input);

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith('userId');

  expect(packagesRepo.findById).toHaveBeenCalledTimes(1);
  expect(packagesRepo.findById).toHaveBeenCalledWith('packageId');

  expect(pagarmeProvider.createCustomer).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCustomer).toHaveBeenCalledWith({
    type: 'individual',
    name: mockedUser.name,
    email: mockedUser.email,
    document: input.payerData.document,
    document_type: 'CPF',
    phones: {
      mobile_phone: {
        country_code: '55',
        area_code: '24',
        number: '998179466',
      },
    },
  });

  expect(pagarmeProvider.createCard).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createCard).toHaveBeenCalledWith('customerId', {
    number: input.paymentData.number,
    holder_name: input.paymentData.holderName,
    exp_month: input.paymentData.expMonth,
    exp_year: input.paymentData.expYear,
    cvv: input.paymentData.cvv,
    billing_address: {
      country: input.paymentData.billingAddress.country,
      city: input.paymentData.billingAddress.city,
      state: input.paymentData.billingAddress.state,
      zip_code: input.paymentData.billingAddress.zipCode,
      street: input.paymentData.billingAddress.street,
      number: input.paymentData.billingAddress.number,
      neighborhood: input.paymentData.billingAddress.neighborhood,
      complement: input.paymentData.billingAddress.complement,
    },
  });

  expect(pagarmeProvider.createSubscription).toHaveBeenCalledTimes(1);
  expect(pagarmeProvider.createSubscription).toHaveBeenCalledWith({
    customer_id: 'customerId',
    description: 'package name',
    installments: 1,
    interval_count: 1,
    card_id: 'cardId',
    pricing_scheme: {
      price: 1000,
      scheme_type: 'unit',
      minimum_price: 1000,
    },
    minimum_price: 1000,
    quantity: 1,
  });

  expect(usersRepo.updateById).toHaveBeenCalledTimes(1);
  expect(usersRepo.updateById).toHaveBeenCalledWith('userId', { 
    subscriptionId: 'subscriptionId',
    packageId: 'packageId',
    subscriptionStatus: 'active'
  });

  expect(subscriptionsRepo.insert).toHaveBeenCalledTimes(1);
  expect(subscriptionsRepo.insert).toHaveBeenCalledWith({
    userId: 'userId',
    packageId: 'packageId',
    subscriptionId: 'subscriptionId',
  });
});
