import { config } from './config.js';

export type Target = keyof typeof config.target;

export interface Packet {
  id: number;
  type: string;
  topic: boolean;
  data: string;
  process: Record<string, string>;
}

export interface Log {
  name: string;
  message: string;
}

export interface QData {
  event: string;
  name: string;
  message: string;
}
