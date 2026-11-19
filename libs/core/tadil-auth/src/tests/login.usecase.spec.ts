// uuid ships ESM only, which this jest setup does not transform.
jest.mock('uuid', () => ({ v4: () => 'uuid' }));

import { ROLE, LOGIN_REQUEST_STATUS } from '@tadil-users';
import { LoginUseCase } from '../application/login.usecase';

describe('LoginUseCase approval', () => {
  const tailor = {
    id: 'tailor-1',
    phone: '0500000000',
    firstName: 'A',
    lastName: 'B',
    role: ROLE.TAILOR,
    loginRequestStatus: LOGIN_REQUEST_STATUS.APPROVED,
    loginToken: 'approval',
  };

  it('spends the approval on one login so the next login asks again', async () => {
    const repo = {
      getUserByPhone: jest.fn().mockResolvedValue(tailor),
      updateUser: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new LoginUseCase(repo as any, 'secret');

    const first = await useCase.execute(tailor.phone);
    expect(first.status).toBe('authenticated');
    // null, not undefined: Prisma skips undefined fields on update.
    expect(repo.updateUser).toHaveBeenCalledWith(
      expect.objectContaining({ loginToken: null, loginRequestStatus: null })
    );

    repo.getUserByPhone.mockResolvedValue({ ...tailor, loginToken: null, loginRequestStatus: null });
    const second = await useCase.execute(tailor.phone);
    expect(second.status).toBe('pending');
  });
});
