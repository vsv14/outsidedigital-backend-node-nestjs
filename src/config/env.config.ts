import { ConfigModule } from "@nestjs/config";
import * as Joi from '@hapi/joi';
import { DynamicModule } from "@nestjs/common";



function GetConfig(): DynamicModule{
    return ConfigModule.forRoot({
        validationSchema: Joi.object({
          LOCALHOST_PORT: Joi.number(),
          POSTGRES_HOST: Joi.string().required(),
          POSTGRES_PORT: Joi.number().required(),
          POSTGRES_USER: Joi.string().required(),
          POSTGRES_PASSWORD: Joi.string().required(),
          POSTGRES_DB: Joi.string().required(),
        })
      });
}


const EnvConfigModule: DynamicModule = GetConfig();

export default EnvConfigModule;