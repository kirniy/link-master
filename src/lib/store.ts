import { create } from 'zustand';
import { createLinkList, getLinkList, type LinkList } from './db';

export interface UrlEntry {
  url: string;
  comment?: string;
}

export interface UrlList {
  id: string;
  name: string;
  urls: UrlEntry[];
  created_at?: string;
  user_id?: string;
}

interface State {
  theme: 'light' | 'dark';
  language: 'en' | 'ru';
  loading: boolean;
  error: string | null;
  linkList: LinkList | null;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'ru') => void;
  createList: (data: { name: string; urls: { url: string; comment?: string }[] }) => Promise<string>;
  getList: (id: string) => Promise<void>;
  reset: () => void;
}

export const useStore = create<State>((set) => ({
  theme: 'light',
  language: 'en',
  loading: false,
  error: null,
  linkList: null,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  createList: async (data) => {
    set({ loading: true, error: null });
    try {
      const id = await createLinkList(data);
      return id;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getList: async (id) => {
    set({ loading: true, error: null });
    try {
      const list = await getLinkList(id);
      set({ linkList: list });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  reset: () => set({ loading: false, error: null, linkList: null })
}));