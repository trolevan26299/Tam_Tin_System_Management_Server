/* eslint-disable prettier/prettier */
import type { Model, Types } from 'mongoose';
import type { DocumentType } from '@typegoose/typegoose';
import type { PaginateModel } from '../utils/paginate';

// Sử dụng trực tiếp DocumentType
export type MongooseDoc<T> = DocumentType<T>;

export type MongooseModel<T> = Model<MongooseDoc<T>> &
  PaginateModel<MongooseDoc<T>>;

export type MongooseID = Types.ObjectId | string;
export type MongooseObjectID = Types.ObjectId;

export type WithID<T> = T & { _id: Types.ObjectId };