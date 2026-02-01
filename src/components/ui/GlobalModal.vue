<script lang="ts" setup>
  import { onMounted, onUnmounted } from 'vue';
  import { useModal } from '@/composables/useModal';

  const { modals, close } = useModal();

  const onEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modals.length > 0) close();
  };

  onMounted(() => window.addEventListener('keydown', onEsc));
  onUnmounted(() => window.removeEventListener('keydown', onEsc));
</script>

<template>
  <Teleport to="body">
    <TransitionGroup name="fade" tag="div">
      <div
        v-for="modal in modals"
        :key="modal.id"
        class="modal-overlay"
        @click.self="close(modal.id)"
      >
        <component :is="modal.component" v-bind="modal.props" />
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
