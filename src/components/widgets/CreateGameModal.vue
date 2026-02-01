<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import ButtonBase from '../ui/ButtonBase.vue';
  import InputBase from '../ui/InputBase.vue';
  import { useUserStore } from '@/stores/user.store';
  import { useGamesStore } from '@/stores/game.store';

  const { closeSelf } = defineProps<{
    closeSelf: () => void;
  }>();

  const desc = ref<string>('');
  const isError = ref<boolean>(false);
  const userStore = useUserStore();
  const gamesStore = useGamesStore();

  watch(desc, () => {
    if (desc.value.length > 0) {
      isError.value = false;
    }
  });

  const onSubmit = async () => {
    if (!desc.value || !userStore.user) {
      isError.value = true;
      return;
    }

    const payload = {
      description: desc.value,
      owner: userStore.user,
      players: [userStore.user],
    };

    try {
      await gamesStore.addGame(payload);
      closeSelf();
    } catch (e) {
      console.error(e);
    }
  };
</script>

<template>
  <div class="wrapp">
    <InputBase :placeholder="$t('description')" v-model="desc" :isError="isError" />
    <ButtonBase @click="onSubmit">{{ $t('create') }}</ButtonBase>
  </div>
</template>

<style scoped>
  .wrapp {
    padding: 40px;
    display: flex;
    align-items: center;
    gap: 40px;
    border-radius: 10px;
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(10px);
  }
</style>
