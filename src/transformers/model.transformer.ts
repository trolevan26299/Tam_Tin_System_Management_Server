/* eslint-disable prettier/prettier */
import { Connection } from 'mongoose';
import { Provider, Inject } from '@nestjs/common';
import { getModelForClass } from '@typegoose/typegoose';
import {
  DB_CONNECTION_TOKEN,
  DB_MODEL_TOKEN_SUFFIX,
} from '../constants/system.constant';

export interface TypegooseClass {
  new (...args: any[]);
}

export function getModelToken(modelName: string): string {
  return modelName + DB_MODEL_TOKEN_SUFFIX;
}

// Get Provider by Class
export function getProviderByTypegooseClass(
  typegooseClass: TypegooseClass,
  collectionName?: string,
): Provider {
  collectionName = collectionName || typegooseClass.name;
  return {
    provide: getModelToken(typegooseClass.name),
    useFactory: (connection: Connection) =>
      getModelForClass(typegooseClass, {
        existingConnection: connection,
        schemaOptions: { collection: collectionName },
      }),
    inject: [DB_CONNECTION_TOKEN],
  };
}

// Model injecter
export function InjectModel(model: TypegooseClass) {
  return Inject(getModelToken(model.name));
}
