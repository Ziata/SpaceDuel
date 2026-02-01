<script setup lang="ts">
  import ButtonBase from '@/components/ui/ButtonBase.vue';
  import { useGamesStore } from '@/stores/game.store';
  import { useUserStore } from '@/stores/user.store';
  import type { IGame } from '@/types/game';
  import { formatDistance } from 'date-fns';
  import { computed } from 'vue';

  const { game } = defineProps<{ game: IGame }>();

  const userStore = useUserStore();
  const gameStore = useGamesStore();

  const isMyGame = computed(() => userStore.user?.id === game.owner.id);
</script>

<template>
  <div class="wrap">
    <div>{{ game.description }}</div>
    <span>{{ game.owner.name }}</span>
    <span>
      {{ formatDistance(new Date(), new Date(game.createdAt), { addSuffix: true }) }}
    </span>
    <ButtonBase
      v-if="isMyGame && userStore.user"
      size="small"
      @click="gameStore.onRemoveGame(game._id)"
      >{{ $t('remove') }}</ButtonBase
    >
    <ButtonBase v-else-if="userStore.user" size="small">{{ $t('join') }}</ButtonBase>
  </div>
</template>

<style scoped>
  .wrap {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    align-items: center;
    gap: 12px;
    color: var(--input-text-color);
  }
</style>
