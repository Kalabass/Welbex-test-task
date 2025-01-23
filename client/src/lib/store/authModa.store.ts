import { create } from 'zustand';

const uesAuthModalStore = create<{
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export { uesAuthModalStore };
