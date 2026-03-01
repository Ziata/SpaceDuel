<script setup lang="ts"></script>

<template>
  <div class="wrap"></div>
</template>

<style scoped>
  .wrap {
    width: 180px;
    height: 100%;
    max-height: 250px;
    border-radius: 8px;
    backdrop-filter: blur(5px);
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
    position: relative;
    background-image: url('/src/assets/img/cover.png');
    background-size: cover;
    background-position: center;
    border: 1px solid color-mix(in srgb, var(--input-primary-color) 50%, transparent);
  }
</style>
