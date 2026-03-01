<script setup lang="ts">
  import { gameSocket } from '@/socket/gameSocket';
  import { useUserStore } from '@/stores/user.store';
  import type { ICardBase } from '@/types/card';
  import type { IActiveGame } from '@/types/game';
  import DronesIcon from '@/assets/icons/drones.svg';
  import EnergyIcon from '@/assets/icons/psiEnergy.svg';
  import NanoIcon from '@/assets/icons/nanomaterials.svg';
  import CloseIcon from '@/assets/icons/close.svg';

  import { ResourceType } from '@/types/user';
  import { computed, toRefs } from 'vue';

  const props = withDefaults(
    defineProps<{
      card: ICardBase;
      game: IActiveGame;
      isUsable?: boolean;
    }>(),
    {
      isUsable: true,
    }
  );

  const { card, game, isUsable } = toRefs(props);

  const userStore = useUserStore();

  const icons = {
    [ResourceType.Drones]: DronesIcon,
    [ResourceType.PsiEnergy]: EnergyIcon,
    [ResourceType.Nanomaterials]: NanoIcon,
  };

  const playCard = () => {
    if (isDisabled.value || !isUsable.value) return;
    const userId = userStore.user?.id;
    if (!userId) {
      console.warn('No user logged in, cannot play card');
      return;
    }
    gameSocket.playCardWS(game.value._id, userId, card.value.id);
  };

  const discardCard = () => {
    const userId = userStore.user?.id;
    if (!userId) {
      console.warn('No user logged in, cannot discard card');
      return;
    }
    gameSocket.discardCardWS(game.value._id, userId, card.value.id);
  };

  const isDisabled = computed(() => {
    const userId = userStore.user?.id;
    if (!userId) return true;
    const available =
      game.value.players.find((p) => p.id === userId)?.resources?.[card.value.type] ?? 0;
    return available < card.value.cost;
  });
</script>

<template>
  <div
    class="wrap"
    :class="[card.type, { disabled: isDisabled, notUsable: !isUsable }]"
    v-if="card"
    @click="playCard"
  >
    <div class="header">
      <div class="icon">
        <component :is="icons[card.type]" />
      </div>
      <div class="price">{{ card.cost }}</div>
    </div>
    <h4>{{ card.name }}</h4>
    <div class="image">
      <img :src="`/cards/${card.type}/${card.id}.jpg`" :alt="card.name" />
    </div>
    <div class="description">{{ card.description }}</div>
    <button v-if="isUsable" @click.stop="discardCard" class="discardBtn"><CloseIcon /></button>
  </div>
</template>

<style scoped>
  .wrap {
    width: 180px;
    height: 100%;
    max-height: 250px;
    border-radius: 8px;
    backdrop-filter: blur(5px);
    padding: 6px 12px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    transition:
      box-shadow 0.35s ease,
      transform 0.2s ease,
      filter 0.2s ease;
    h4 {
      font-size: 16px;
      height: 45px;
      margin-top: 2px;
      text-align: center;
      width: 100%;
    }
    &:hover .discardBtn {
      opacity: 1;
      pointer-events: auto;
    }
  }

  .wrap.notUsable {
    cursor: default;
  }

  .wrap.disabled:not(.notUsable) {
    opacity: 0.8;
    cursor: not-allowed;
    filter: grayscale(0.8) brightness(0.75);
  }

  .wrap.disabled:hover:not(.notUsable) {
    box-shadow: none;
    transform: none;
  }

  .wrap:hover:has(.discardBtn:hover) {
    box-shadow: none;
  }

  .wrap.drones {
    background: color-mix(in srgb, var(--drones) 10%, transparent);
    color: color-mix(in srgb, var(--drones) 85%, transparent);
  }

  .wrap.drones:hover:not(.disabled):not(.notUsable) {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
      0 0 6px color-mix(in srgb, var(--drones) 60%, transparent),
      0 0 18px color-mix(in srgb, var(--drones) 50%, transparent),
      0 0 40px color-mix(in srgb, var(--drones) 35%, transparent),
      0 12px 30px rgba(0, 0, 0, 0.6);
  }

  .wrap.psiEnergy {
    background: color-mix(in srgb, var(--psiEnergy) 10%, transparent);
    color: color-mix(in srgb, var(--psiEnergy) 85%, transparent);
  }

  .wrap.psiEnergy:hover:not(.disabled):not(.notUsable) {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
      0 0 8px color-mix(in srgb, var(--psiEnergy) 65%, transparent),
      0 0 22px color-mix(in srgb, var(--psiEnergy) 50%, transparent),
      0 0 50px color-mix(in srgb, var(--psiEnergy) 35%, transparent),
      0 12px 30px rgba(0, 0, 0, 0.6);
  }

  .wrap.nanomaterials {
    background: color-mix(in srgb, var(--nanomaterials) 10%, transparent);
    color: color-mix(in srgb, var(--nanomaterials) 85%, transparent);
  }

  .wrap.nanomaterials:hover:not(.disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
      0 0 6px color-mix(in srgb, var(--nanomaterials) 60%, transparent),
      0 0 20px color-mix(in srgb, var(--nanomaterials) 45%, transparent),
      0 0 45px color-mix(in srgb, var(--nanomaterials) 30%, transparent),
      0 12px 30px rgba(0, 0, 0, 0.6);
  }

  .wrap.drones,
  .wrap.drones .price,
  .wrap.drones .icon,
  .wrap.drones .discardBtn {
    border: 1px solid color-mix(in srgb, var(--drones) 85%, transparent);
  }

  .wrap.psiEnergy,
  .wrap.psiEnergy .price,
  .wrap.psiEnergy .icon,
  .wrap.psiEnergy .discardBtn {
    border: 1px solid color-mix(in srgb, var(--psiEnergy) 85%, transparent);
  }

  .wrap.nanomaterials,
  .wrap.nanomaterials .price,
  .wrap.nanomaterials .icon,
  .wrap.nanomaterials .discardBtn {
    border: 1px solid color-mix(in srgb, var(--nanomaterials) 85%, transparent);
  }

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    width: 30px;
    height: 30px;
    font-size: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    font-weight: 700;
  }

  .drones .price {
    color: color-mix(in srgb, var(--drones) 85%, transparent);
  }
  .psiEnergy .price {
    color: color-mix(in srgb, var(--psiEnergy) 85%, transparent);
  }
  .nanomaterials .price {
    color: color-mix(in srgb, var(--nanomaterials) 85%, transparent);
  }

  .icon {
    width: 30px;
    height: 30px;
    border-radius: 5px;
  }

  .image {
    margin: 2px 0;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .description {
    height: 64px;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
  }

  .discardBtn {
    position: absolute;
    background: var(--input-bg-color);
    bottom: -4px;
    left: -4px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      opacity 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.2s ease;
  }

  .discardBtn:hover {
    transform: scale(1.2);
  }

  .drones .discardBtn {
    svg {
      fill: color-mix(in srgb, var(--drones) 85%, transparent);
    }
  }
  .drones .discardBtn:hover {
    box-shadow:
      0 0 6px color-mix(in srgb, var(--drones) 70%, transparent),
      0 0 16px color-mix(in srgb, var(--drones) 50%, transparent);
  }

  .psiEnergy .discardBtn {
    svg {
      fill: color-mix(in srgb, var(--psiEnergy) 85%, transparent);
    }
  }
  .psiEnergy .discardBtn:hover {
    box-shadow:
      0 0 8px color-mix(in srgb, var(--psiEnergy) 70%, transparent),
      0 0 20px color-mix(in srgb, var(--psiEnergy) 50%, transparent);
  }

  .nanomaterials .discardBtn {
    svg {
      fill: color-mix(in srgb, var(--nanomaterials) 85%, transparent);
    }
  }
  .nanomaterials .discardBtn:hover {
    box-shadow:
      0 0 6px color-mix(in srgb, var(--nanomaterials) 70%, transparent),
      0 0 18px color-mix(in srgb, var(--nanomaterials) 50%, transparent);
  }
</style>
