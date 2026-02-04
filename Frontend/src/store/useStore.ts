import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface Model {
  id: string;
  name: string;
  isFree?: boolean;
}

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
  conversations: any[];
  messages: any[]; // Current chat messages

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setCredits: (credits: number) => void;
  
  setSelectedModel: (model: Model | null) => void;
  setModels: (models: Model[]) => void;
  setConversations: (conversations: any[]) => void;
  addConversation: (conversation: any) => void;
  setMessages: (messages: any[] | ((prev: any[]) => any[])) => void;
  
  logout: () => void;
}

type AppPersist = (
  config: StateCreator<AppState>,
  options: PersistOptions<AppState>
) => StateCreator<AppState>;

export const useStore = create<AppState>(
  (persist as AppPersist)(
    (set): AppState => ({
      user: null,
      token: null,
      credits: 0,
      selectedModel: null,
      models: [],
      conversations: [],
      messages: [],

      setUser: (user: User | null): void => set({ user }),
      setToken: (token: string | null): void => set({ token }),
      setCredits: (credits: number): void => set({ credits }),
      
      setSelectedModel: (model: Model | null): void => set({ selectedModel: model }),
      setModels: (models: Model[]): void => set({ models }),
      setConversations: (conversations: any[]): void => set({ conversations }),
      addConversation: (conversation: any): void => set((state) => ({ conversations: [conversation, ...state.conversations] })),
      setMessages: (messagesOrFn: any[] | ((prev: any[]) => any[])): void => set((state) => ({ 
        messages: typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn 
      })),
      
      logout: (): void => set({ user: null, token: null, selectedModel: null, credits: 0, conversations: [], messages: [] }),
    }),
    {
      name: 'webmind-storage',
    }
  )
);
