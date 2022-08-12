import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from '../modules/user/entities/user.entity';
import { Tag } from '../modules/tag/entities/tag.entity';

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService)=>({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_DB'),
                entities: [User, Tag],
                migrations: ["src/migration/*.ts"],
                synchronize: false,

            })
        })
    ]
})
export class DatabaseModule {}