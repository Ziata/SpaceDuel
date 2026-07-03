<script setup lang="ts">
  import { computed } from 'vue';

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

  const { player, position } = defineProps<{
    player: IPlayerPublicState;
    position: 'left' | 'right';
  }>();

  const planets = [Panet_1, Panet_2, Panet_3, Panet_4, Panet_5, Panet_6, Panet_7, Panet_8];

  const planetImage = computed(() => {
    const hash = player.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return planets[hash % planets.length];
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
          <div>
            <HealthIcon />
            {{ player.planetIntegrity }}
          </div>
        </div>

        <div>
          <span>{{ $t('shield') }}</span>
          <div>
            <ShieldIcon />
            {{ player.orbitalShield }}
          </div>
        </div>
      </div>

      <div class="resources">
        <div v-for="res in resourceConfig" :key="res.key" class="resource" :class="res.key">
          <component :is="res.icon" />

          <div class="resource-info">
            <span class="resource-name">
              {{ $t(res.key) }}
            </span>

            <span class="resource-values">
              <b>{{ player.resources[res.key] }}</b>
              (<b>+{{ player.production[res.key] }}</b>
              <span class="per-turn">{{ $t('per turn') }}</span
              >)
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
          opacity: player.orbitalShield > 30 ? 0.7 : player.orbitalShield * 0.02,
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
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    color: var(--input-text-color);
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    h4 {
      width: 100%;
      margin: 0;
      text-align: center;
      font-size: 24px;
      color: var(--input-primary-color);
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

  .stats {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    margin-top: 4px;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      > div {
        display: flex;
        align-items: center;
        flex-direction: row;
        white-space: nowrap;
        font-size: 20px;
        color: var(--input-primary-color);
        svg {
          width: 50px;
          height: 50px;
        }
      }
      > span {
        margin-bottom: -4px;
      }
    }
  }

  .resources {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    margin-top: 4px;
  }

  .resource {
    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 16px;

    svg {
      width: 40px;
      height: 40px;
      flex-shrink: 0;
    }
  }

  .resource-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .resource-values {
    white-space: nowrap;
  }

  .resource.drones {
    color: var(--drones);

    svg {
      border: 1px solid color-mix(in srgb, var(--drones) 50%, transparent);
      border-radius: 5px;
    }
  }

  .resource.psiEnergy {
    color: var(--psiEnergy);

    svg {
      border: 1px solid color-mix(in srgb, var(--psiEnergy) 50%, transparent);
      border-radius: 5px;
    }
  }

  .resource.nanomaterials {
    color: var(--nanomaterials);

    svg {
      border: 1px solid color-mix(in srgb, var(--nanomaterials) 50%, transparent);
      border-radius: 5px;
    }
  }

  .planet {
    position: relative;

    width: 100%;
    height: 100%;

    margin-top: -30%;
    z-index: 0;

    img {
      position: absolute;

      width: 200%;
      max-width: 200%;
      height: auto;
    }

    img.left {
      left: -80%;
    }

    img.right {
      right: -80%;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .animate-planet {
    animation: spin 260s linear infinite;
  }

  .animate-shield {
    animation: spin 60s linear infinite;
  }

  @media screen and (max-width: 991px) {
    .stats > div > div {
      font-size: 16px;

      svg {
        width: 40px;
        height: 40px;
      }
    }

    .resource {
      font-size: 14px;
      svg {
        width: 30px;
        height: 30px;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .header h4 {
      font-size: 18px;
    }

    .stats {
      flex-direction: column;
      align-items: flex-start;
      margin-top: 0;
      gap: 4px;
    }

    .stats > div > span {
      display: none;
    }

    .stats > div > div svg {
      width: 30px;
      height: 30px;
    }

    .resource-name,
    .per-turn {
      display: none;
    }

    .resource-info {
      align-items: center;
    }

    .planet img.left {
      left: -140%;
    }

    .planet img.right {
      right: -140%;
    }
  }

  @media (max-width: 576px) {
    .header {
      padding: 2px;
    }
    .planet {
      margin-top: 0;
    }
    .stats {
      gap: 1px;
    }
    .resource {
      font-size: 13px;
      svg {
        width: 22px;
        height: 22px;
      }
    }
  }
</style>
