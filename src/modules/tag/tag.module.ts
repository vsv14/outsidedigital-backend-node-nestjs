import { Tag } from './entities/tag.entity';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagMiddleware } from '../../middlewares/tag.middleware';

@Module({
  imports:[
    TypeOrmModule.forFeature([Tag])
  ],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TagMiddleware)
      .forRoutes(
        { path: 'tag', method: RequestMethod.POST },
        { path: 'tag/*', method: RequestMethod.PUT }
      );
  }
}
