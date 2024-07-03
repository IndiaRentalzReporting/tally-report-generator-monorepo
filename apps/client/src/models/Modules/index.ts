import { Action } from '..';

export interface Module {
  name: string;
  icon: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
}
