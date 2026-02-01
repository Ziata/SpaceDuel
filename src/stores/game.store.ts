import { ref } from 'vue';
import { defineStore } from 'pinia';
import { createGame, getGames, joinGame, removeGame } from '@/api/game';
import type { ICreateGameRequest, IGame } from '@/types/game';
import type { IUser } from '@/types/user';

export const useGamesStore = defineStore('games', () => {
  const games = ref<IGame[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchGames = async () => {
    loading.value = true;
    error.value = null;

    try {
      games.value = await getGames();
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message;
        throw e;
      } else {
        throw new Error('error');
      }
    } finally {
      loading.value = false;
    }
  };

  const addGame = async (data: ICreateGameRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const savedGame = await createGame(data);
      games.value = [...games.value, savedGame];
      return savedGame;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message;
        throw e;
      } else {
        throw new Error('error');
      }
    } finally {
      loading.value = false;
    }
  };

  const onJoinGame = async (gameId: string, user: IUser) => {
    const updatedGame = await joinGame(gameId, user);
    games.value = games.value.map((game) => (game._id === gameId ? updatedGame : game));
  };

  const onRemoveGame = async (gameId: string) => {
    await removeGame(gameId);
    games.value = games.value.filter((game) => game._id !== gameId);
  };

  return {
    games,
    loading,
    error,
    fetchGames,
    addGame,
    onRemoveGame,
    onJoinGame,
  };
});
