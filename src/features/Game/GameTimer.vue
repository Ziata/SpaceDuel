<script setup lang="ts">
  import { gameSocket } from '@/socket/gameSocket';
  import type { IActiveGame } from '@/types/game';
  import { ref, onUnmounted } from 'vue';

  const timeLeft = ref(0);

  let raf: number | null = null;
  let turnEndsAt = 0;
  let offset = 0;

  function updateTimer() {
    const left = turnEndsAt - (Date.now() + offset);

    timeLeft.value = Math.max(0, Math.ceil(left / 1000));

    if (left > 0) {
      raf = requestAnimationFrame(updateTimer);
    }
  }

  function startTimer(newTurnEndsAt: number, newOffset: number) {
    turnEndsAt = newTurnEndsAt;
    offset = newOffset;

    if (raf) cancelAnimationFrame(raf);

    updateTimer();
  }

  // общий обработчик
  function handleTurnUpdate(state: { game: IActiveGame; serverNow: number }) {
    const newOffset = state.serverNow - Date.now();
    startTimer(state.game.turnEndsAt, newOffset);
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
  }
</style>
