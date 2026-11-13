import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Model, Conversation, ChatMessage } from '@/types/models';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  credits: number;
}

interface AppState {
  user: User | null;
  token: string | null;
  credits: number;
  selectedModel: Model | null;
  models: Model[];
  conversations: Conversation[];
  messages: ChatMessage[]; // Current chat messages

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setCredits: (credits: number) => void;

  setSelectedModel: (model: Model | null) => void;
  setModels: (models: Model[]) => void;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;

  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set): AppState => ({
      user: null,
      token: null,
      credits: 0,
      selectedModel: null,
      models: [],
      conversations: [],
      messages: [],

      setUser: (user: User | null): void => set({ user }),
      setToken: (token: string | null): void => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
        set({ token });
      },
      setCredits: (credits: number): void => set({ credits }),

      setSelectedModel: (model: Model | null): void => set({ selectedModel: model }),
      setModels: (models: Model[]): void => set({ models }),
      setConversations: (conversations: Conversation[]): void => set({ conversations }),
      addConversation: (conversation: Conversation): void => set((state) => ({ conversations: [conversation, ...state.conversations] })),
      setMessages: (messagesOrFn: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])): void => set((state) => ({
        messages: typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn
      })),

      logout: (): void => {
        localStorage.removeItem('token');
        set({ user: null, token: null, selectedModel: null, credits: 0, conversations: [], messages: [] });
      },
    }),
    {
      name: 'webmind-storage',
      skipHydration: true,
    }
  )
);
