/* eslint-disable prettier/prettier */
import { createHash } from 'crypto';

// md5
export function decodeMD5(value: string): string {
  return createHash('md5').update(value).digest('hex');
}
