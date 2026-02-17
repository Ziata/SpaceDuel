<script setup lang="ts">
  import type { IPlayerPublicState } from '@/types/user';
  import DronesIcon from '@/assets/icons/drones.svg';
  import Panet_1 from '@/assets/img/planet-1.png';
  import Panet_2 from '@/assets/img/planet-2.png';
  import Panet_3 from '@/assets/img/planet-3.png';
  import Panet_4 from '@/assets/img/planet-4.png';
  import Panet_5 from '@/assets/img/planet-5.png';
  import Panet_6 from '@/assets/img/planet-6.png';
  import Panet_7 from '@/assets/img/planet-7.png';
  import Panet_8 from '@/assets/img/planet-8.png';
  import Shield from '@/assets/img/shield.png';
  import { computed } from 'vue';

  const { player, position } = defineProps<{
    player: IPlayerPublicState;
    position: 'left' | 'right';
  }>();

  const planets = [Panet_1, Panet_2, Panet_3, Panet_4, Panet_5, Panet_6, Panet_7, Panet_8];
  const planetImage = computed(() => {
    const hash = player.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0); // простой хэш имени
    const index = hash % planets.length;
    return planets[index];
  });
</script>

<template>
  <div class="wrap">
    <div class="header" :class="position">
      <h4>{{ player.name }}</h4>
      <span>{{ $t('HP') }}: {{ player.planetIntegrity }}</span>
      <span>{{ $t('shield') }}: {{ player.orbitalShield }}</span>
      <span
        ><DronesIcon class="icon" /> {{ $t('drones') }}: {{ player.resources.drones }} (+{{
          player.production.drones
        }})</span
      >
      <span
        >{{ $t('nanomaterials') }}: {{ player.resources.nanomaterials }} (+{{
          player.production.nanomaterials
        }})</span
      >
      <span
        >{{ $t('psiEnergy') }}: {{ player.resources.psiEnergy }} (+{{
          player.production.psiEnergy
        }})</span
      >
    </div>
    <div class="planet">
      <img :src="planetImage" alt="planet" class="animate-planet" :class="position" />
      <img
        :src="Shield"
        alt="shield"
        class="animate-shield"
        :class="position"
        :style="{
          opacity: player.orbitalShield > 40 ? 0.4 : Number('0.' + player.orbitalShield),
        }"
      />
    </div>
  </div>
</template>

<style scoped>
  .wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(4px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    color: var(--input-text-color);
    h4 {
      font-size: 20px;
      color: var(--input-primary-color);
    }
    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  .header.left {
    align-items: flex-start;
  }

  .header.right {
    align-items: flex-end;
  }

  .planet {
    position: relative;
    width: 100%;
    height: 100%;
    img {
      width: 200%;
      max-width: 200%;
      height: auto;
      position: absolute;
    }

    img.left {
      left: -80%;
    }

    img.right {
      right: -80%;
    }

    .shieald {
      opacity: 0.4;
    }
  }

  @-webkit-keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .animate-planet {
    -webkit-animation: spin 60s linear infinite;
    animation: spin 260s linear infinite;
  }

  .animate-shield {
    -webkit-animation: spin 60s linear infinite;
    animation: spin 60s linear infinite;
  }
</style>
