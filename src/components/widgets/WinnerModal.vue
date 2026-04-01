<script lang="ts" setup>
  import ButtonBase from '../ui/ButtonBase.vue';

  const { closeSelf, winner } = defineProps<{
    closeSelf: () => void;
    winner: string;
  }>();
</script>

<template>
  <div class="wrapp">
    <h4>{{ $t('winnerMessage', { name: winner }) }}</h4>
    <ButtonBase @click="closeSelf">{{ $t('close') }}</ButtonBase>
  </div>
</template>

<style scoped>
  .wrapp {
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    border-radius: 10px;
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(10px);
    max-width: 90vw;
    h4 {
      font-size: 30px;
      color: var(--input-primary-color);
    }
  }
</style>
