import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from './translations';
import { supabase } from './supabase';

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

interface Store {
  language: Language;
  theme: 'light' | 'dark' | 'system';
  lists: UrlList[];
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addList: (list: Omit<UrlList, 'id' | 'created_at' | 'user_id'>) => Promise<string>;
  getList: (id: string) => UrlList | undefined;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'system',
      lists: [],
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      addList: async (list) => {
        const id = crypto.randomUUID();
        const newList = {
          ...list,
          id,
          created_at: new Date().toISOString(),
        } as UrlList;
        
        try {
          // First try to get the current user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error('Error getting user:', userError);
            // Continue without user, as it's optional
          }
          
          // If there's a user, add their ID to the list
          if (user) {
            newList.user_id = user.id;
          }
          
          const { data, error } = await supabase
            .from('url_lists')
            .insert([newList])
            .select()
            .single();

          if (error) {
            console.error('Error saving to Supabase:', error);
            throw new Error(`Failed to save list: ${error.message}`);
          }

          if (!data) {
            throw new Error('No data returned from Supabase after insert');
          }

          set((state) => ({ lists: [...state.lists, newList] }));
          return id;
        } catch (error) {
          console.error('Error in addList:', error);
          throw error;
        }
      },
      getList: (id) => {
        const list = get().lists.find((list) => list.id === id);
        if (!list) {
          // Try to fetch from Supabase if not in local state
          supabase
            .from('url_lists')
            .select('*')
            .eq('id', id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                set((state) => ({ lists: [...state.lists, data] }));
              }
            });
        }
        return list;
      },
    }),
    {
      name: 'url-opener-storage',
    }
  )
);