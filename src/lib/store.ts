import { create } from 'zustand';
import { createLinkList, getLinkList, getUserLists, deleteList, updateList, type LinkList } from './db';
import { useAuth } from './auth';

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
  userLists: LinkList[];
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'ru') => void;
  createList: (data: { name: string; urls: { url: string; comment?: string }[] }) => Promise<string>;
  getList: (id: string) => Promise<void>;
  getUserLists: () => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  updateList: (id: string, data: Partial<Omit<LinkList, "id" | "createdAt" | "userId">>) => Promise<void>;
  reset: () => void;
}

export const useStore = create<State>((set) => ({
  theme: 'dark',
  language: 'en',
  loading: false,
  error: null,
  linkList: null,
  userLists: [],
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  createList: async (data) => {
    set({ loading: true, error: null });
    try {
      const user = useAuth.getState().user;
      const id = await createLinkList({
        ...data,
        userId: user?.uid
      });
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
  getUserLists: async () => {
    const user = useAuth.getState().user;
    if (!user) return;
    
    set({ loading: true, error: null });
    try {
      const lists = await getUserLists(user.uid);
      set({ userLists: lists });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteList: async (id) => {
    const user = useAuth.getState().user;
    if (!user) throw new Error('Authentication required');
    
    set({ loading: true, error: null });
    try {
      await deleteList(id, user.uid);
      set(state => ({
        userLists: state.userLists.filter(list => list.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateList: async (id, data) => {
    const user = useAuth.getState().user;
    if (!user) throw new Error('Authentication required');
    
    set({ loading: true, error: null });
    try {
      await updateList(id, user.uid, data);
      // Refresh the list after update
      const list = await getLinkList(id);
      set(state => ({
        linkList: state.linkList?.id === id ? list : state.linkList,
        userLists: state.userLists.map(l => l.id === id ? list : l)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  reset: () => set({
    loading: false,
    error: null,
    linkList: null,
    userLists: []
  })
}));