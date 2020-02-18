import { config } from './config';

export type Target = keyof typeof config.target;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Packet = Record<string, any>;

export interface Log {
  name: string;
  message: string;
}

export interface QData {
  event: string;
  name: string;
  message: string;
}
