import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getGames } from '@/api/game';
import type { IGame } from '@/types/game';
import type { ICardBase } from '@/types/card';

export const useGamesStore = defineStore('games', () => {
  const games = ref<IGame[]>([]);
  const allCards = ref<ICardBase[]>([]);
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

  return {
    games,
    loading,
    error,
    fetchGames,
    allCards,
  };
});
