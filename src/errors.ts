import type { NICErrorCode } from './types';

export class NICError extends Error {
  readonly code: NICErrorCode;
  readonly input: unknown;

  constructor(code: NICErrorCode, message: string, input: unknown) {
    super(message);
    this.name = 'NICError';
    this.code = code;
    this.input = input;
  }
}
