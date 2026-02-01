<script lang="ts" setup>
  import { useUserStore } from '@/stores/user.store';
  import ButtonBase from '../ui/ButtonBase.vue';
  import LangSwitcher from './LangSwitcher.vue';
  import UserModal from '@/components/widgets/UserModal.vue';
  import { useModal } from '@/composables/useModal';

  const { open } = useModal();

  const store = useUserStore();

  const openModal = () => {
    open({ component: UserModal });
  };
</script>

<template>
  <header class="header">
    <LangSwitcher />
    <div class="header__user" v-if="store.user">
      <div class="header__user-name">{{ store.user.name }}</div>
      <ButtonBase :size="'small'" @click="store.onExitUser">{{ $t('exit') }}</ButtonBase>
    </div>
    <ButtonBase v-else @click="openModal">{{ $t('enter') }}</ButtonBase>
  </header>
</template>

<style scoped>
  .header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 40px;
    padding: 6px 24px;
  }
  .header__user {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 49px;
    padding: 2px 20px 2px 12px;
    background-color: rgba(226, 226, 226, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 4px;
  }
  .header__user-name {
    font-size: 30px;
    color: var(--input-primary-color);
    overflow: hidden;
    margin-right: 10px;
  }
</style>
