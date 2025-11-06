import { Provider, Scope } from '@nestjs/common';
import { environment } from '../../environments/environment';
import { DataReader, DbClient } from '@tadil-database';

const DbClientProvider: Provider<DbClient> = {
  provide: DbClient,
  useFactory: () => {
    const client = new DbClient(environment.tadilDb);
    client.$connect();
    console.log('new DbClient created !');
    return client;
  },
  scope: Scope.DEFAULT,
};

const DataReaderProvider: Provider<DataReader> = {
  provide: DataReader,
  useFactory: (dbClient: DbClient) => {
    return new DataReader(dbClient);
  },
  inject: [DbClient],
  scope: Scope.REQUEST,
};

export { DbClientProvider, DataReaderProvider };
