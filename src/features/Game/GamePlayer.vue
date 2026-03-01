<script setup lang="ts">
  import { ResourceType, type IPlayerPublicState } from '@/types/user';
  import DronesIcon from '@/assets/icons/drones.svg';
  import EnergyIcon from '@/assets/icons/psiEnergy.svg';
  import NanoIcon from '@/assets/icons/nanomaterials.svg';
  import HealthIcon from '@/assets/icons/health.svg';
  import ShieldIcon from '@/assets/icons/shield.svg';
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

  const resourceConfig = [
    {
      key: ResourceType.Drones,
      icon: DronesIcon,
    },
    {
      key: ResourceType.PsiEnergy,
      icon: EnergyIcon,
    },
    {
      key: ResourceType.Nanomaterials,
      icon: NanoIcon,
    },
  ];
</script>

<template>
  <div class="wrap">
    <div class="header" :class="position">
      <h4>{{ player.name }}</h4>
      <div class="stats">
        <div>
          <span>{{ $t('integrity') }}</span>
          <div><HealthIcon />: {{ player.planetIntegrity }}</div>
        </div>
        <div>
          <span>{{ $t('shield') }}</span>
          <div><ShieldIcon />: {{ player.orbitalShield }}</div>
        </div>
      </div>

      <div class="resources">
        <div v-for="res in resourceConfig" :key="res.key" class="resource" :class="res.key">
          <component :is="res.icon" />
          <div>
            <span>{{ $t(res.key) }}</span>
            <span>
              <b>{{ player.resources[res.key] }}</b>
              (<b>+{{ player.production[res.key] }}</b> {{ $t('per turn') }})
            </span>
          </div>
        </div>
      </div>
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
    gap: 4px;
  }

  .header {
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    padding: 10px;
    display: flex;
    flex-direction: column;
    color: var(--input-text-color);
    position: relative;
    z-index: 1;
    h4 {
      width: 100%;
      text-align: center;
      font-size: 24px;
      color: var(--input-primary-color);
    }
  }

  .stats {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    width: 100%;
    margin-top: 4px;
    div {
      display: flex;
      align-items: center;
      flex-direction: column;
      div {
        display: flex;
        align-items: center;
        flex-direction: row;
        color: var(--input-primary-color);
        white-space: nowrap;
        font-size: 20px;
        svg {
          width: 50px;
          height: 50px;
        }
      }
      span {
        margin-bottom: -4px;
      }
    }
  }

  .resources {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 2px;
    width: 100%;
  }

  .resource {
    display: flex;
    gap: 6px;
    font-size: 16px;
    align-items: center;

    svg {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }

    div {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }

    span:last-child {
      white-space: nowrap;
    }
  }

  .resource.drones {
    color: var(--drones);
    svg {
      border-radius: 5px;
      border: 1px solid color-mix(in srgb, var(--drones) 50%, transparent);
    }
  }

  .resource.psiEnergy {
    color: var(--psiEnergy);
    svg {
      border-radius: 5px;
      border: 1px solid color-mix(in srgb, var(--psiEnergy) 50%, transparent);
    }
  }

  .resource.nanomaterials {
    color: var(--nanomaterials);
    svg {
      border-radius: 5px;
      border: 1px solid color-mix(in srgb, var(--nanomaterials) 50%, transparent);
    }
  }

  .header.left {
    align-items: flex-start;
    border-bottom-right-radius: 10px;
  }

  .header.right {
    align-items: flex-end;
    border-bottom-left-radius: 10px;
  }

  .planet {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 0;
    margin-top: -30%;
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
