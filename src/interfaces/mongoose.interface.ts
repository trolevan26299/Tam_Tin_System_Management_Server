/* eslint-disable prettier/prettier */
import type { Model, Types } from 'mongoose';
import type { DocumentType } from '@typegoose/typegoose';
import type { PaginateModel } from '../utils/paginate';

export type MongooseDoc<T> = Omit<DocumentType<T>, '_id' | 'id'> &
  T & { _id: Types.ObjectId };
export type MongooseModel<T> = Model<MongooseDoc<T>> &
  PaginateModel<MongooseDoc<T>>;

export type MongooseID = Types.ObjectId | string;
export type MongooseObjectID = Types.ObjectId;

export type WithID<T> = T & { _id: Types.ObjectId };
