import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Sidebar
  showSidebar: boolean;
  sidebarWidth: number;

  // Theme
  theme: 'light' | 'dark' | 'auto';

  // Layout
  messageLayout: 'bubble' | 'flat';

  // Modals
  openModal: string | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setMessageLayout: (layout: 'bubble' | 'flat') => void;
  setOpenModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        showSidebar: true,
        sidebarWidth: 260,
        theme: 'light',
        messageLayout: 'bubble',
        openModal: null,

        toggleSidebar: () =>
          set((state) => ({ showSidebar: !state.showSidebar })),

        setSidebarWidth: (width) => set({ sidebarWidth: width }),

        setTheme: (theme) => set({ theme }),

        setMessageLayout: (layout) => set({ messageLayout: layout }),

        setOpenModal: (modal) => set({ openModal: modal }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          messageLayout: state.messageLayout,
          sidebarWidth: state.sidebarWidth,
        }),
      }
    )
  )
);
