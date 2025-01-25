import { find } from "../../../../../core/DependencyInjection";
import { FetchInterestOverTimeOutput } from "../../../../../providers/trends/dtos/interestOverTimeTrendsDTO";
import { TrendsProvider, trendsProviderAlias } from "../../../../../providers/trends/TrendsProvider";
import { UserNotFoundError } from "../../../../errors/UserNotFoundError";
import { User } from "../../../users/entities/User";
import { UsersRepository, usersRepositoryAlias } from "../../../users/repositories/UsersRepository";
import { SearchInterestUseCase } from "../SearchInterestUseCase";


const usecase = find<SearchInterestUseCase>(SearchInterestUseCase);
const usersRepository = find<UsersRepository>(usersRepositoryAlias);
const trendsProvider = find<TrendsProvider>(trendsProviderAlias);

it('should throw USER_NOT_FOUND if user does not exist', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue(null);

  await expect(usecase.execute({
    keyword: 'test',
    userId: '1',
  })).rejects.toMatchObject(new UserNotFoundError());

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');
});

it('should return trends interest by keyword', async () => {
  jest.spyOn(usersRepository, 'findById').mockResolvedValue({ id: '1' } as User);
  jest.spyOn(trendsProvider, 'fetchInterestOverTime').mockResolvedValue({
    default: {
      timelineData: [{
        formattedAxisTime: '2021-01-01',
        value: [100],
        formattedTime: '2021-01-01',
        hasData: [true],
        time: '1609459200000',
        isPartial: false,
      }]
    }
  } as FetchInterestOverTimeOutput);

  const result = await usecase.execute({
    keyword: 'test',
    userId: '1',
  });

  expect(usersRepository.findById).toHaveBeenCalledTimes(1);
  expect(usersRepository.findById).toHaveBeenCalledWith('1');

  expect(trendsProvider.fetchInterestOverTime).toHaveBeenCalledTimes(1);
  expect(trendsProvider.fetchInterestOverTime).toHaveBeenCalledWith({
    keyword: ['test'],
    geo: ['BR'],
    startTime: expect.any(Date),
    endTime: undefined,
  });

  expect(result).toEqual({
    default: {
      timelineData: [{
        formattedAxisTime: '2021-01-01',
        value: [100],
        formattedTime: '2021-01-01',
        hasData: [true],
        time: '1609459200000',
        isPartial: false,
      }]
    }
  });
});