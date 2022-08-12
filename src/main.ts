import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');


  
  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get('PORT') || configService.get('LOCALHOST_PORT');
 
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('Project API with Swagger')
    .setVersion('1.0')
    .addBearerAuth({type: 'http'}, 'defaultBearerAuth')
    .build();
 
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  
  await app.listen(PORT, '0.0.0.0', ()=>console.log(`Server listen port:${PORT}`));
}


bootstrap();