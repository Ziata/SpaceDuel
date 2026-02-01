<script lang="ts" setup>
  interface Props {
    size?: 'small' | 'medium' | 'large';
    active?: boolean;
  }

  const { active, size = 'medium' } = defineProps<Props>();
</script>

<template>
  <button :class="[size, { active }]">
    <span class="label"><slot></slot></span>
    <span class="icon">
      <span></span>
    </span>
    <span class="icon2"> </span>
  </button>
</template>

<style scoped>
  button {
    float: left;
    position: relative;
    color: #fff;
    cursor: pointer;
    background: transparent;
    border: none;
    font-size: 18px;
    .label {
      padding: 10px 22px;
      display: inline-block;
    }
    .icon2 {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: skew(-40deg, 0deg) scaleX(0.2);
      transition: all 0.2s;
    }
    .icon {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: skew(-40deg, 0deg);
      transition: all 0.2s;

      &:before,
      &:after {
        content: '';
        height: 1px;
        width: 30px;
        position: absolute;
        display: block;
        background: var(--input-primary-color);
        transition: all 0.2s;
        transition-delay: 0s;
      }
      &:before {
        left: 0;
        top: 0;
      }
      &:after {
        right: 0;
        bottom: 0;
      }
      span {
        &:before,
        &:after {
          content: '';
          background: var(--input-primary-color);
          position: absolute;
          display: block;
          width: 2px;
          height: 30px;
          transition: all 0.2s;
          transition-delay: 0.4s;
        }
        &:before {
          left: 0;
          top: 0;
        }
        &:after {
          right: 0;
          bottom: 0;
        }
      }
    }
    &:hover {
      .icon {
        transform: scale(0.9) skew(0deg, 0deg);
        &:before,
        &:after {
          width: 60px;
          transition-delay: 0.4s;
        }
        &:before {
          left: calc(50% - 30px);
        }
        &:after {
          right: calc(50% - 30px);
        }

        span {
          &:before,
          &:after {
            height: 0;
            transition-delay: 0s;
          }
        }
      }
      .icon2 {
        transform: skew(-40deg, 0deg) scaleX(1);
        background: var(--input-primary-color);
        z-index: -1;
        transition-delay: 0.5s;
      }
    }
    &.active {
      color: var(--input-primary-color);
      &:hover {
        transition: 0.5s all ease-in-out;
        color: #fff;
      }
    }
  }

  button.small {
    height: 28px;
    font-size: 12px;
    .label {
      padding: 6px 12px;
    }
    .icon {
      span {
        &:before,
        &:after {
          height: 20px;
        }
      }
      &:before,
      &:after {
        width: 20px;
      }
    }
    &:hover {
      .icon {
        &:before {
          left: calc(50% - 20px);
        }
        &:after {
          right: calc(50% - 20px);
        }
        span {
          &:before,
          &:after {
            height: 0;
          }
        }
      }
    }
  }
</style>
