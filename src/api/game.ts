import type { ICreateGameRequest, IGame } from '@/types/game';
import type { IUser } from '@/types/user';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const createGame = async (gameData: ICreateGameRequest): Promise<IGame> => {
  const response = await api.post('/games', gameData);
  return response.data;
};

export const getGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const joinGame = async (gameId: string, user: IUser): Promise<IGame> => {
  const res = await api.put(`/games/${gameId}/join`, user);
  return res.data;
};

export const removeGame = async (gameId: string): Promise<void> => {
  await api.delete(`/games/${gameId}`);
};
