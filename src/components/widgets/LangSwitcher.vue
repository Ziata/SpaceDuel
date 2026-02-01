<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import ButtonBase from '../ui/ButtonBase.vue';

  const { locale } = useI18n();

  const languages = [
    { code: 'ua', label: 'UA' },
    { code: 'en', label: 'EN' },
  ];

  const setLocale = (code: string) => {
    locale.value = code;
  };
</script>

<template>
  <div class="lang-switcher">
    <ButtonBase
      v-for="lang in languages"
      :key="lang.code"
      :active="locale === lang.code"
      :size="'small'"
      @click="setLocale(lang.code)"
      >{{ lang.label }}</ButtonBase
    >
  </div>
</template>

<style scoped>
  .lang-switcher {
    display: inline-flex;
    padding: 4px;
    gap: 1px;
    position: relative;
  }

  .lang-switcher::before,
  .lang-switcher::after {
    content: '';
    width: 100%;
    position: absolute;
    transform: skew(-40deg);
    top: 0;
  }

  .lang-switcher::before {
    left: -20px;
  }

  .lang-switcher::after {
    right: -20px;
  }
  button {
    z-index: 1;
    & *::after,
    & *::before {
      content: none !important;
    }
  }
</style>
