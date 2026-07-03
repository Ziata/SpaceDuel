<script setup lang="ts">
  import { gameSocket } from '@/socket/gameSocket';
  import type { IActiveGame } from '@/types/game';
  import { ref, onUnmounted } from 'vue';

  const timeLeft = ref(0);

  let raf: number | null = null;

  // обновляем таймер чисто через серверное время
  function updateTimer(turnEndsAt: number, serverNow: number) {
    const left = turnEndsAt - serverNow;
    timeLeft.value = Math.max(0, Math.ceil(left / 1000));

    if (left > 0) {
      // следующий шаг через 100-200 мс для плавности
      raf = requestAnimationFrame(() => updateTimer(turnEndsAt, serverNow + 16));
    }
  }

  function startTimer(turnEndsAt: number, serverNow: number) {
    if (raf) cancelAnimationFrame(raf);
    updateTimer(turnEndsAt, serverNow);
  }

  // общий обработчик всех событий
  function handleTurnUpdate(state: { game: IActiveGame; serverNow: number }) {
    startTimer(state.game.turnEndsAt, state.serverNow);
  }

  // подписки
  gameSocket.onGameStateWS(handleTurnUpdate);
  gameSocket.onGameStartedWS(handleTurnUpdate);
  gameSocket.onPlayCardWS(handleTurnUpdate);
  gameSocket.onDiscardCardWS(handleTurnUpdate);

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf);
  });
</script>

<template>
  <div class="wrap">{{ timeLeft }}</div>
</template>

<style scoped>
  .wrap {
    font-size: 26px;
    font-weight: bold;
    @media (max-width: 991px) {
      font-size: 18px;
    }
  }
</style>
