import { DataSource, DataSourceOptions} from "typeorm";
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { resolve } from "path";




const configService = new ConfigService();

dotenv.config();


const config: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: [resolve(__dirname, '../modules/**/entities/*.entity{.ts,.js}') ],
    migrations: [resolve(__dirname, '../migrations/*{.ts,.js}')],
    synchronize: false
  };
  
  const datasource = new DataSource(config);
  datasource.initialize()
  .then(() => console.log("Data Source has been initialized"))
  .catch((error) => console.error("Error initializing Data Source", error));


  export default datasource;