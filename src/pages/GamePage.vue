<script setup lang="ts">
  import 'swiper/css';
  import 'swiper/css/effect-coverflow';

  import { getActiveGame } from '@/api/game';
  import PlayCard from '@/features/Game/PlayCard.vue';
  import GamePlayer from '@/features/Game/GamePlayer.vue';
  import { gameSocket } from '@/socket/gameSocket';
  import { useUserStore } from '@/stores/user.store';
  import type { IActiveGame } from '@/types/game';
  import { ref, onMounted, computed, watchEffect, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import CoverCard from '@/features/Game/CoverCard.vue';
  import { useModal } from '@/composables/useModal';
  import WinnerModal from '@/components/widgets/WinnerModal.vue';
  import router from '@/router';
  import GameTimer from '@/features/Game/GameTimer.vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { useWindowSize } from '@vueuse/core';
  import { EffectCoverflow } from 'swiper/modules';

  const { width } = useWindowSize();
  const isTablet = computed(() => width.value < 1280);
  const { open } = useModal();
  const route = useRoute();
  const userStore = useUserStore();

  const game = ref<IActiveGame>();
  const loading = ref(false);
  const error = ref<string | null>(null);
  let visibilityHandler: (() => void) | null = null;

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

    gameSocket.onPlayCardWS((state) => {
      if (state.game._id === game.value?._id) {
        game.value = state.game;
      }
    });

    gameSocket.onDiscardCardWS((state) => {
      if (state.game._id === game.value?._id) {
        game.value = state.game;
      }
    });

    gameSocket.onReconnect(() => {
      gameSocket.joinGameRoomWS(gameId, userStore.user!.id);
    });

    gameSocket.onGameEndedWS(({ winnerId }) => {
      const name = game.value?.players.find((plyer) => plyer.id === winnerId)?.name;
      open({
        component: WinnerModal,
        props: {
          winner: name,
        },
        onClose: async () => {
          await router.replace({ name: 'main' });
        },
      });
    });

    visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        gameSocket.joinGameRoomWS(gameId, userStore.user!.id);
      }
    };

    document.addEventListener('visibilitychange', visibilityHandler);
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

  onUnmounted(() => {
    if (visibilityHandler) {
      document.removeEventListener('visibilitychange', visibilityHandler);
    }
  });
</script>

<template>
  <main class="main" v-if="game">
    <GamePlayer v-if="currentPlayer" :player="currentPlayer" class="left" :position="'left'" />
    <div class="center">
      <div class="top">
        {{ $t('waiting for player') }}: {{ game.players[game.currentPlayer]?.name }}
        <GameTimer :game="game" />
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
    <div class="hand desktop" v-if="!isTablet">
      <PlayCard
        v-for="card in currentPlayer?.hand || []"
        :key="card.id"
        :card="card"
        :game="game"
      />
    </div>
    <Swiper
      v-else
      :modules="[EffectCoverflow]"
      class="slider"
      :initialSlide="2"
      :slidesPerView="'auto'"
      :centeredSlides="true"
      :effect="'coverflow'"
      :grabCursor="true"
      :coverflowEffect="{
        rotate: 20,
        stretch: -10,
        depth: 200,
        modifier: 1,
        slideShadows: true,
        scale: 0.9,
      }"
    >
      <SwiperSlide v-for="card in currentPlayer?.hand || []" :key="card.id" class="slide">
        <PlayCard :card="card" :game="game" />
      </SwiperSlide>
    </Swiper>
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
    align-items: center;
    z-index: 1;
    font-size: 24px;
    color: var(--input-primary-color);
    margin: 0 auto;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    @media (max-width: 991px) {
      font-size: 16px;
    }
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
    overflow: auto;
    @media (max-width: 1280px) {
      justify-content: flex-start;
    }
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
    @media (max-width: 1280px) {
      display: none;
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

  .slider {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
    width: 100%;
    padding: 20px;
  }

  .slide {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    background: #000;
    border-radius: 8px;
    > div {
      width: 180px;
      max-height: 250px;
    }
  }

  @media (max-width: 768px) {
    .main-deck {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: auto;
      z-index: 1;
      height: 250px;
      max-width: 95vw;
      margin: 0 auto;
      > div {
        &:not(:first-child) {
          margin-left: -100px;
        }
      }
    }
    .slider {
      padding: 26px 0 6px;
    }
    .slide div {
      max-height: 230px;
    }
  }

  @media (max-width: 576px) {
    .main {
      grid-template-columns: 100px 1fr 100px;
    }
    .top {
      font-size: 12px;
      text-align: center;
    }

    .slide div {
      max-height: 200px;
    }
  }
</style>
