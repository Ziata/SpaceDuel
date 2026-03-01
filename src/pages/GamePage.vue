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
  import CoverCard from '@/features/Game/CoverCard.vue';

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

  const getCardStyle = (index: number, total: number) => {
    const maxVisible = 3;
    const visibleIndex = total > maxVisible ? index : index;
    const offsetX = 10;
    const offsetY = 7;
    return {
      position: 'absolute',
      left: `${visibleIndex * offsetX}px`,
      top: `${visibleIndex * offsetY}px`,
      zIndex: visibleIndex,
    };
  };

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
      <div class="top">
        {{ $t('waiting for player') }}: {{ game.players[game.currentPlayer]?.name }}
      </div>
      <div class="field">
        <div class="deck">
          <CoverCard
            v-for="(card, index) in (game.deck || []).slice(-3)"
            :key="card.id"
            :style="getCardStyle(index, (game.deck || []).length)"
          />
        </div>
        <div class="main-deck">
          <PlayCard
            v-for="card in game.activeCards || []"
            :key="card.id"
            :card="card"
            :game="game"
            :isUsable="false"
          />
        </div>
        <div class="deck">
          <CoverCard
            v-for="(card, index) in (game.discardPile || []).slice(-3)"
            :key="card.id"
            :style="getCardStyle(index, (game.discardPile || []).length)"
          />
        </div>
      </div>
    </div>
    <GamePlayer v-if="opponent" :player="opponent" class="right" :position="'right'" />
    <div class="hand">
      <PlayCard
        v-for="card in currentPlayer?.hand || []"
        :key="card.id"
        :card="card"
        :game="game"
      />
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .top {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    font-size: 24px;
    color: var(--input-primary-color);
    margin: 0 auto;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
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

  .hand {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
    width: 100%;
    display: flex;
    padding: 20px;
    height: 290px;
    gap: 10px;
    justify-content: center;
  }

  .field {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 20px 20px;
    gap: 20px;
    justify-content: space-between;
  }

  .deck {
    display: flex;
    align-items: center;
    min-width: 220px;
    position: relative;
    height: 250px;
    flex-shrink: 0;

    div {
      position: absolute;
    }
  }

  .main-deck {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    overflow: auto;
    padding: 20px 0;
  }
</style>
