<script setup lang="ts">
  import ButtonBase from '@/components/ui/ButtonBase.vue';
  import CreateGameModal from '@/components/widgets/CreateGameModal.vue';
  import { useModal } from '@/composables/useModal';
  import { useGamesStore } from '@/stores/game.store';
  import { useUserStore } from '@/stores/user.store';
  import { computed, onMounted } from 'vue';
  import GameListItem from '@/features/GamesList/GameListItem.vue';
  import LoaderBase from '@/components/widgets/LoaderBase.vue';
  import router from '@/router';
  import { gameSocket } from '@/socket/gameSocket';
  import HeaderBase from '@/components/widgets/HeaderBase.vue';

  const { open } = useModal();
  const userStore = useUserStore();
  const gamesStore = useGamesStore();

  const openModal = () => {
    open({
      component: CreateGameModal,
    });
  };

  onMounted(() => {
    gamesStore.fetchGames();

    gameSocket.onGameCreatedWS((game) => {
      gamesStore.games.push(game);
    });

    gameSocket.onGameDeletedWS((gameId) => {
      gamesStore.games = gamesStore.games.filter((g) => g._id !== gameId);
    });

    gameSocket.onPlayerJoinedWS((updatedGame) => {
      gamesStore.games = gamesStore.games.map((g) => (g._id === updatedGame._id ? updatedGame : g));
    });

    gameSocket.onGameStartedWS(({ gameId }) => {
      router.push(`/game/${gameId}`);
    });
  });

  const hasMyGame = computed(() => {
    return !!gamesStore.games.find((game) => game.owner.id === userStore.user?.id);
  });
</script>

<template>
  <HeaderBase />
  <main class="main">
    <ButtonBase v-if="!hasMyGame && userStore.user" @click="openModal">{{
      $t('create_game')
    }}</ButtonBase>
    <div class="main__games">
      <LoaderBase v-if="gamesStore.loading" />
      <div v-else-if="!gamesStore.games.length" class="main__empty">{{ $t('empty_here') }}</div>
      <GameListItem v-else v-for="game in gamesStore.games" :key="game._id" :game />
    </div>
  </main>
</template>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 0 20px;
    gap: 20px;
  }

  .main__games {
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    width: 600px;
    max-height: 50vh;
    border-radius: 10px;
    padding: 10px 20px 10px;
    gap: 12px;
    overflow: auto;
    max-width: 90vw;
    min-height: 170px;
  }

  .main__empty {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--input-text-color);
    opacity: 0.7;
  }
</style>
