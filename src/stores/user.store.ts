import { ref } from 'vue';
import { defineStore } from 'pinia';
import { USER_STORE } from '@/types/localStorage';
import { v4 } from 'uuid';
import type { IUser } from '@/types/user';

export const useUserStore = defineStore('user', () => {
  const user = ref<IUser | null>(null);

  const savedUser = localStorage.getItem(USER_STORE);
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }

  const onExitUser = () => {
    user.value = null;
    localStorage.removeItem(USER_STORE);
  };

  const onEnterUser = (name: string) => {
    const userData = {
      name,
      id: v4(),
    };
    user.value = userData;
    localStorage.setItem(USER_STORE, JSON.stringify(userData));
  };

  return { user, onExitUser, onEnterUser };
});
