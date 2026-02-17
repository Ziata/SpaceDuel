<script setup lang="ts">
  import { gameSocket } from '@/socket/gameSocket';
  import { useUserStore } from '@/stores/user.store';
  import type { ICardBase } from '@/types/card';
  import type { IActiveGame } from '@/types/game';

  const { card, game } = defineProps<{ card: ICardBase; game: IActiveGame }>();
  const userStore = useUserStore();

  const playCard = () => {
    const userId = userStore.user?.id;
    if (!userId) {
      console.warn('No user logged in, cannot play card');
      return;
    }
    gameSocket.playCardWS(game._id, userId, card.id);
  };

  const discardCard = () => {
    const userId = userStore.user?.id;
    if (!userId) {
      console.warn('No user logged in, cannot discard card');
      return;
    }
    gameSocket.discardCardWS(game._id, userId, card.id);
  };
</script>

<template>
  <div class="wrap" v-if="card" @click="playCard">
    <h4>{{ card.name }}</h4>
    <div class="image">тут будет картинка</div>
    <div class="description">{{ card.description }}</div>
    <Button @click.stop="discardCard">x</Button>
    <div class="cost">
      {{ card.type }} <span>{{ card.cost }}</span>
    </div>
  </div>
</template>

<style scoped>
  .wrap {
    width: 15%;
    min-width: 180px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    backdrop-filter: blur(5px);
    max-width: 250px;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    h4 {
      color: var(--input-text-color);
      font-size: 16px;
      text-align: center;
      height: 45px;
    }
  }

  .description {
    color: var(--input-text-color);
    font-size: 14px;
    margin-top: 10px;
  }

  .image {
    flex-grow: 1;
  }

  .cost {
    color: var(--input-text-color);
    font-size: 14px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
</style>
