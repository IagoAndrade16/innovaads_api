import { find } from "../../../../../core/DependencyInjection";
import { FetchFacebookAdsOutput } from "../../../../../providers/facebook/@types/FacebookGraphApiAdsTypes";
import { FacebookGraphApiAds, facebookGraphApiAdsAlias } from "../../../../../providers/facebook/FacebookGraphApiAds";
import { DomainError } from "../../../../errors/DomainError";
import { UnauthorizedError } from "../../../../errors/Unauthorized";
import { User } from "../../../users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../users/repositories/UsersRepository";
import { FetchCreativesUseCase, FetchCreativesUseCaseInput } from "../FetchCreativesUseCase";

const usecase = find(FetchCreativesUseCase);

const usersRepo = find<UsersRepository>(usersRepositoryAlias);
const facebookGraphApiAds = find<FacebookGraphApiAds>(facebookGraphApiAdsAlias);

it('should throw INVALID_CREDENTIALS error when user is not found', async () => {
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce(null);

  const input: FetchCreativesUseCaseInput = {
    filters: {
      ad_reached_countries: 'BR',
      search_terms: 'test',
    },
    fields: {},
    nextRequestUrl: '',
    userId: 'invalid_user_id',
  };

  await expect(usecase.execute(input)).rejects.toEqual(new UnauthorizedError('INVALID_CREDENTIALS'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(input.userId);
});

it('should throw NO_FACEBOOK_ACCOUNT_FOUND error when user has no facebook account', async () => {
  const mockedUser = {
    facebookCredential: null,
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce(mockedUser);

  const input: FetchCreativesUseCaseInput = {
    filters: {
      ad_reached_countries: 'BR',
      search_terms: 'test',
    },
    fields: {},
    nextRequestUrl: '',
    userId: 'user_id',
  };
  await expect(usecase.execute(input)).rejects.toEqual(new UnauthorizedError('NO_FACEBOOK_ACCOUNT_FOUND'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(input.userId);
});

it('should return creatives and paging when facebook account is found', async () => {
  const mockedUser = {
    facebookCredential: {
      accessToken: 'valid_access_token',
    }
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce(mockedUser);

  const input: FetchCreativesUseCaseInput = {
    filters: {
      ad_reached_countries: 'BR',
      search_terms: 'test',
    },
    fields: {},
    nextRequestUrl: '',
    userId: 'user_id',
  };

  const mockedResponse: FetchFacebookAdsOutput = {
    status: 'SUCCESS',
    data: {
      ads: [],
      paging: {
        cursors: {
          before: 'before_cursor',
          after: 'after_cursor',
        },
      }
    }
  };
  jest.spyOn(facebookGraphApiAds, 'fetchCreatives').mockResolvedValueOnce(mockedResponse);

  const result = await usecase.execute(input);

  expect(result).toEqual({
    creatives: mockedResponse.data!.ads,
    paging: mockedResponse.data!.paging,
  });

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(input.userId);

  expect(facebookGraphApiAds.fetchCreatives).toHaveBeenCalledTimes(1);
  expect(facebookGraphApiAds.fetchCreatives).toHaveBeenCalledWith(
    {
      filters: input.filters,
      fields: FacebookGraphApiAds.baseFieldsToFetchCreatives,
      nextRequestUrl: input.nextRequestUrl,
    },
    { access_token: mockedUser.facebookCredential!.accessToken! }
  );
});

it('should threow INVALID_FACEBOOK_TOKEN error when facebook token is invalid', async () => {
  const mockedUser = {
    facebookCredential: {
      accessToken: 'valid_access_token',
    }
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce(mockedUser);

  const input: FetchCreativesUseCaseInput = {
    filters: {
      ad_reached_countries: 'BR',
      search_terms: 'test',
    },
    fields: {},
    nextRequestUrl: '',
    userId: 'user_id',
  };

  const mockedResponse: FetchFacebookAdsOutput = {
    status: 'UNAUTHORIZED',
    data: {
      ads: [],
      paging: {
        cursors: {
          before: 'before_cursor',
          after: 'after_cursor',
        },
      }
    }
  };
  jest.spyOn(facebookGraphApiAds, 'fetchCreatives').mockResolvedValueOnce(mockedResponse);

  await expect(usecase.execute(input)).rejects.toEqual(new DomainError(400, 'INVALID_FACEBOOK_TOKEN'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(input.userId);

  expect(facebookGraphApiAds.fetchCreatives).toHaveBeenCalledTimes(1);
  expect(facebookGraphApiAds.fetchCreatives).toHaveBeenCalledWith(
    {
      filters: input.filters,
      fields: FacebookGraphApiAds.baseFieldsToFetchCreatives,
      nextRequestUrl: input.nextRequestUrl,
    },
    { access_token: mockedUser.facebookCredential!.accessToken! }
  );
});

it('should threow ERROR_FETCHING_ADS error when facebook token is invalid', async () => {
  const mockedUser = {
    facebookCredential: {
      accessToken: 'valid_access_token',
    }
  } as User;
  jest.spyOn(usersRepo, 'findById').mockResolvedValueOnce(mockedUser);

  const input: FetchCreativesUseCaseInput = {
    filters: {
      ad_reached_countries: 'BR',
      search_terms: 'test',
    },
    fields: {},
    nextRequestUrl: '',
    userId: 'user_id',
  };

  const mockedResponse: FetchFacebookAdsOutput = {
    status: 'ERROR',
    data: {
      ads: [],
      paging: {
        cursors: {
          before: 'before_cursor',
          after: 'after_cursor',
        },
      }
    }
  };
  jest.spyOn(facebookGraphApiAds, 'fetchCreatives').mockResolvedValueOnce(mockedResponse);

  await expect(usecase.execute(input)).rejects.toEqual(new DomainError(400, 'ERROR_FETCHING_ADS'));

  expect(usersRepo.findById).toHaveBeenCalledTimes(1);
  expect(usersRepo.findById).toHaveBeenCalledWith(input.userId);

  expect(facebookGraphApiAds.fetchCreatives).toHaveBeenCalledTimes(1);
  expect(facebookGraphApiAds.fetchCreatives).toHaveBeenCalledWith(
    {
      filters: input.filters,
      fields: FacebookGraphApiAds.baseFieldsToFetchCreatives,
      nextRequestUrl: input.nextRequestUrl,
    },
    { access_token: mockedUser.facebookCredential!.accessToken! }
  );
});

