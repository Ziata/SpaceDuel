import type { IActiveGame } from './game';
import type { ResourceType } from './user';

export type CardEffect = (game: IActiveGame, cardId: string) => IActiveGame;

export type CardType = 'construction' | 'attack' | 'special';

export interface ICardBase {
  id: string;
  name: string;
  type: ResourceType;
  cost: number;
  description: string;
}
