import { v4 } from 'uuid';
import { reactive, type Component } from 'vue';

export type ModalOptions = {
  id?: string;
  component: Component;
  props?: Record<string, unknown>;
  onClose?: () => void;
};

export type ModalInstance = ModalOptions & { id: string };

const modals = reactive<ModalInstance[]>([]);

const updateBodyScroll = () => {
  document.body.style.overflow = modals.length > 0 ? 'hidden' : '';
};

export function useModal() {
  const open = (options: ModalOptions) => {
    const id = options.id || v4();

    const closeSelf = () => close(id);

    modals.push({
      ...options,
      id,
      props: {
        ...(options.props || {}),
        closeSelf,
      },
    });

    updateBodyScroll();
    return { id, close: () => close(id) };
  };

  const close = (id?: string) => {
    if (id) {
      const index = modals.findIndex((m) => m.id === id);
      if (index !== -1) {
        modals[index]?.onClose?.();
        modals.splice(index, 1);
      }
    } else {
      const last = modals.pop();
      last?.onClose?.();
    }
    updateBodyScroll();
  };

  const closeAll = () => {
    while (modals.length) {
      const m = modals.pop();
      m?.onClose?.();
    }
    updateBodyScroll();
  };

  return { modals, open, close, closeAll };
}
