/* eslint-disable prettier/prettier */
import helmet from 'helmet';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { HttpExceptionFilter } from '@app/filters/error.filter';
import { TransformInterceptor } from '@app/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ErrorInterceptor } from '@app/interceptors/error.interceptor';
import { environment, isProdEnv } from '@app/app.environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import logger from '@app/utils/logger';
import * as express from 'express';
import * as APP_CONFIG from '@app/app.config';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    isProdEnv ? { logger: false } : {},
  );
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  app.use(passport.initialize());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new ErrorInterceptor(),
    new LoggingInterceptor(),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Tâm Tín Management APIs')
    .setDescription('List APIs for Tâm Tín Management System')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('AccountManagement')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis-doc', app, document);
  //end set up swagger
  app.enableCors();
  app.use(express.static('.'));
  return await app.listen(APP_CONFIG.APP.PORT);
}

bootstrap().then(() => {
  logger.info(
    `Tam Tin MNG is running on ${APP_CONFIG.APP.PORT}, env: ${environment}.`,
  );
});
