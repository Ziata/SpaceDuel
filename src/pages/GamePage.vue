<script setup lang="ts">
  import { getActiveGame } from '@/api/game';
  import PlayCard from '@/features/PlayCard/PlayCard.vue';
  import router from '@/router';
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
    <div class="left" v-if="currentPlayer">
      <div class="header">
        <h4>{{ currentPlayer.name }}</h4>
        <span>{{ $t('HP') }}: {{ currentPlayer.planetIntegrity }}</span>
        <span>{{ $t('shield') }}: {{ currentPlayer.orbitalShield }}</span>
        <span
          >{{ $t('drones') }}: {{ currentPlayer.resources.drones }} (+{{
            currentPlayer.production.drones
          }})</span
        >
        <span
          >{{ $t('nanomaterials') }}: {{ currentPlayer.resources.nanomaterials }} (+{{
            currentPlayer.production.nanomaterials
          }})</span
        >
        <span
          >{{ $t('psiEnergy') }}: {{ currentPlayer.resources.psiEnergy }} (+{{
            currentPlayer.production.psiEnergy
          }})</span
        >
      </div>
    </div>

    <div class="center">
      {{ $t('waiting for player') }}: {{ game.players[game.currentPlayer]?.name }}
    </div>

    <div class="right" v-if="opponent">
      <div class="header">
        <h4>{{ opponent.name }}</h4>
        <span>{{ $t('HP') }}: {{ opponent.planetIntegrity }}</span>
        <span>{{ $t('shield') }}: {{ opponent.orbitalShield }}</span>
        <span
          >{{ $t('drones') }}: {{ opponent.resources.drones }} (+{{
            opponent.production.drones
          }})</span
        >
        <span
          >{{ $t('nanomaterials') }}: {{ opponent.resources.nanomaterials }} (+{{
            opponent.production.nanomaterials
          }})</span
        >
        <span
          >{{ $t('psiEnergy') }}: {{ opponent.resources.psiEnergy }} (+{{
            opponent.production.psiEnergy
          }})</span
        >
      </div>
    </div>

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
    grid-template-columns: 300px 1fr 300px;
    grid-template-rows: 1fr auto;
    height: 100%;
    width: 100%;
  }

  .left {
    height: 100%;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .center {
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(4px);
    color: var(--input-text-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right {
    height: 100%;
    grid-column: 3 / 4;
    grid-row: 1 / 2;
  }

  .field {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .header {
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(4px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    color: var(--input-text-color);
  }

  .header h4 {
    font-size: 20px;
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
