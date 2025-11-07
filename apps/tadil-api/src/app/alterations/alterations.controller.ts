import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateAlterationUseCase,
  UpdateAlterationUseCase,
  DeleteAlterationUseCase,
} from '@tadil-alterations';
import { DataReader } from '@tadil-database';

@Controller('alterations')
@ApiTags('Alterations')
export class AlterationsController {
  constructor(
    private readonly _dataReader: DataReader,
    private readonly _createAlterationUseCase: CreateAlterationUseCase,
    private readonly _updateAlterationUseCase: UpdateAlterationUseCase,
    private readonly _deleteAlterationUseCase: DeleteAlterationUseCase
  ) {}
}
