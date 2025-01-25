import { find } from "../../../../../core/DependencyInjection";
import { FetchDailyTrendsOutput } from "../../../../../providers/trends/dtos/dailyTrendsDTO";
import { TrendsProvider, trendsProviderAlias } from "../../../../../providers/trends/TrendsProvider";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../../users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../users/repositories/UsersRepository";
import { FetchDailyTrendsUseCase } from "../FetchDailyTrendsUseCase";


const usecase = find<FetchDailyTrendsUseCase>(FetchDailyTrendsUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const trendsProvider = find<TrendsProvider>(trendsProviderAlias);

it('should throw USER_NOT_FOUND if user does not exist', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    userId: '1',
    geoLocation: 'BR',
  })).rejects.toMatchObject(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');
});

it('should return daily trends', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ id: '1' } as User);
  jest.spyOn(trendsProvider, 'fetchDailyTrends').mockResolvedValue({
    default: {
      trendingSearchesDays: [{
        date: '2021-09-01',
        formattedDate: '2021-09-01',
        trendingSearches: [{
          title: {
            exploreLink: 'https://www.google.com/search?q=Test',
            query: 'Test',
          },
        }]
      }]
    }
  } as FetchDailyTrendsOutput);


  const result = await usecase.execute({
    userId: '1',
    geoLocation: 'BR',
  });

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');

  expect(trendsProvider.fetchDailyTrends).toHaveBeenCalledTimes(1);
  expect(trendsProvider.fetchDailyTrends).toHaveBeenCalledWith({
    geo: 'BR',
    trendDate: expect.any(Date),
  });

  expect(result).toEqual({
    default: {
      trendingSearchesDays: [{
        date: '2021-09-01',
        formattedDate: '2021-09-01',
        trendingSearches: [{
          title: {
            exploreLink: 'https://www.google.com/search?q=Test',
            query: 'Test',
          },
        }]
      }]
    }
  });
});