/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import path from 'path';
import yargs from 'yargs';

const argv = yargs.argv as Record<string, string | void>;
const ROOT_PATH = path?.join(__dirname, '..');

export const APP = {
  PORT: 6969,
  ROOT_PATH,
  DEFAULT_CACHE_TTL: 0,
  NAME: 'Tam Tin Management',
};
export const PROJECT = {
  name: 'Tâm Tín Management',
  version: 'V0.1',
  author: 'Andrew',
  homepage: '',
  documentation: '',
  repository: '',
};

const password = encodeURIComponent('Tro260299');

export const MONGO_DB = {
  uri:
    argv?.db_uri ||
    `mongodb+srv://Tro260299:${password}@cluster0.5mwwmu8.mongodb.net/test_next_auth?retryWrites=true&w=majority&appName=Cluster0`,
};
export const AUTH = {
  expiresIn:
    argv?.auth_expires_in || Math.floor(Date.now() / 1000) + 3 * 60 * 60, // 3 tiếng đồng hồ expire
  data: argv?.auth_data || { user: 'root' },
  jwtSecret: argv?.auth_key || '__tam_tin_management',
};
