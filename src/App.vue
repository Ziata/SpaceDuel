<script setup lang="ts">
  import { RouterView } from 'vue-router';
  import GlobalModal from './components/ui/GlobalModal.vue';
</script>

<template>
  <GlobalModal />
  <RouterView />
</template>

<style>
  body {
    display: flex;
    width: 100%;
    height: 100%;
    background-image: url('../src/assets/img/BlueNebula1-1024x1024.png');
    background-repeat: repeat;
    background-size: 1024px 1024px;
    animation: scrollBg 96s linear infinite;
    will-change: background-position;
  }

  @keyframes scrollBg {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -1024px 0;
    }
  }
</style>
