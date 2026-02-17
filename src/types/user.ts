import type { ICardBase } from './card';

export interface IUser {
  name: string;
  id: string;
}

export type ResourceType = 'nanomaterials' | 'psiEnergy' | 'drones';

// === Полное состояние игрока (на сервере) ===
export interface IPlayerGameState extends IUser {
  planetIntegrity: number;
  orbitalShield: number;
  resources: Record<ResourceType, number>;
  production: Record<ResourceType, number>;
  hand: ICardBase[]; // <-- ЕСТЬ рука
  deck: ICardBase[];
  discardPile: ICardBase[];
}

// === Игрок БЕЗ руки (то, что видят все) ===
export type IPlayerPublicState = Omit<IPlayerGameState, 'hand'>;
