<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import ButtonBase from '../ui/ButtonBase.vue';
  import InputBase from '../ui/InputBase.vue';
  import { useUserStore } from '@/stores/user.store';

  const { closeSelf } = defineProps<{
    closeSelf: () => void;
  }>();

  const store = useUserStore();
  const name = ref<string>('');
  const isError = ref<boolean>(false);

  watch(name, () => {
    if (name.value.length > 0) {
      isError.value = false;
    }
  });

  const onSubmit = () => {
    if (name.value.length > 0) {
      store.onEnterUser(name.value);
      closeSelf();
    } else {
      isError.value = true;
    }
  };
</script>

<template>
  <div class="wrapp">
    <InputBase :placeholder="$t('enter_name')" v-model="name" :isError="isError" />
    <ButtonBase @click="onSubmit">{{ $t('submit') }}</ButtonBase>
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
