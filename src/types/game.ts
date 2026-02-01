import type { IUser } from './user';

export interface IGame {
  _id: string;
  description: string;
  players: IUser[];
  owner: IUser;
  createdAt: string;
}

export interface ICreateGameRequest {
  description: string;
  owner: IUser;
  players: IUser[];
}
