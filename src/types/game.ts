import type { ICardBase } from './card';
import type { IPlayerGameState, IPlayerPublicState, IUser } from './user';

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

export interface IActiveGame {
  _id: string;
  description: string;
  owner: IUser;
  createdAt: string;
  currentPlayer: 0 | 1;
  turn: number;
  /**
   * ВСЕГДА есть:
   * массив всех игроков БЕЗ рук
   */
  players: IPlayerPublicState[];
  /**
   * Есть ТОЛЬКО если передали валидный userId
   */
  playerState?: IPlayerGameState; // <-- С РУКОЙ
  opponent?: IPlayerPublicState; // <-- БЕЗ РУКИ
  /**
   * Для отладки/прозрачности (не обязательно)
   */
  requestedUserId?: string;
  deck: ICardBase[];
}
