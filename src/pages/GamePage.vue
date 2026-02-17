<script setup lang="ts">
  import { getActiveGame } from '@/api/game';
  import PlayCard from '@/features/Game/PlayCard.vue';
  import router from '@/router';
  import GamePlayer from '@/features/Game/GamePlayer.vue';
  import { gameSocket } from '@/socket/gameSocket';
  import { useUserStore } from '@/stores/user.store';
  import type { IActiveGame } from '@/types/game';
  import { ref, onMounted, computed, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const userStore = useUserStore();

  const game = ref<IActiveGame>();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchGame = async (gameId: string) => {
    loading.value = true;
    error.value = null;

    try {
      game.value = await getActiveGame(gameId, userStore.user!.id);
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = 'Unknown error';
      }
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    const gameId = route.params.id as string;
    fetchGame(gameId).then(() => {
      gameSocket.joinGameRoomWS(gameId, userStore.user!.id);
    });

    gameSocket.onPlayCardWS((updatedGame) => {
      if (updatedGame._id === game.value?._id) {
        game.value = updatedGame;
      }
    });

    gameSocket.onDiscardCardWS((updatedGame) => {
      if (updatedGame._id === game.value?._id) {
        game.value = updatedGame;
      }
    });

    gameSocket.onGameEndedWS(({ winnerId }) => {
      if (winnerId === userStore.user?.id) {
        alert('Вы победили!');
      } else {
        alert('Вы проиграли!');
      }

      router.push('/');
    });
  });

  const currentPlayer = computed(() => game.value?.playerState || null);
  const opponent = computed(() => game.value?.opponent || null);

  watchEffect(() => {
    console.log('game сейчас:', game.value);
    if (currentPlayer.value) console.log('currentPlayer сейчас:', currentPlayer.value);
    if (opponent.value) console.log('opponent сейчас:', opponent.value);
  });
</script>

<template>
  <main class="main" v-if="game">
    <GamePlayer v-if="currentPlayer" :player="currentPlayer" class="left" :position="'left'" />
    <div class="center">
      <!-- {{ $t('waiting for player') }}: {{ game.players[game.currentPlayer]?.name }} -->
    </div>
    <GamePlayer v-if="opponent" :player="opponent" class="right" :position="'right'" />
    <div class="field">
      <div class="deck">{{ game.deck.length }}</div>
      <div class="hand">
        <PlayCard
          v-for="card in currentPlayer?.hand || []"
          :key="card.id"
          :card="card"
          :game="game"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
  .main {
    display: grid;
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 1fr auto;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .left {
    height: auto;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-bottom-right-radius: 20px;
  }

  .center {
  }

  .right {
    height: auto;
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-bottom-left-radius: 20px;
  }

  .field {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .hand {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    padding: 20px;
    height: 250px;
  }

  .deck {
    color: var(--input-text-color);
  }
</style>
