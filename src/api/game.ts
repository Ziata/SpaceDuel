import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getGames = async () => {
  const response = await api.get('/games');
  return response.data;
};

export const getActiveGame = async (gameId: string, userId: string) => {
  const response = await api.get(`/games/${gameId}/active`, {
    params: { userId },
  });
  return response.data;
};

export const getAllCards = async () => {
  const response = await api.get(`/cards`);
  return response.data;
};
