import { create } from 'zustand';
import { databaseService } from '../services/databaseService';

export interface QueryResult {
  success: boolean;
  sql_query?: string;
  results?: any[];
  response?: string;
  results_count?: number;
  error?: string;
}

export interface QueryHistoryItem {
  id: string;
  question: string;
  sql: string;
  results_count: number;
  timestamp: string;
  connectionId: string;
}

interface QueryState {
  history: QueryHistoryItem[];
  isLoading: boolean;
  currentResults: QueryResult | null;
  
  executeQuery: (question: string) => Promise<QueryResult>;
  clearResults: () => void;
  clearHistory: () => void;
}

export const useQueryStore = create<QueryState>((set, get) => ({
  history: [],
  isLoading: false,
  currentResults: null,
  
  executeQuery: async (question: string) => {
    set({ isLoading: true });
    
    try {
      const result = await databaseService.executeQuery(question);
      
      if (result.success) {
        const historyItem: QueryHistoryItem = {
          id: `query_${Date.now()}`,
          question,
          sql: result.sql_query || '',
          results_count: result.results_count || 0,
          timestamp: new Date().toISOString(),
          connectionId: 'current-connection-id',
        };
        
        set(state => ({
          history: [historyItem, ...state.history],
          currentResults: result,
          isLoading: false,
        }));
        
        localStorage.setItem('query_history', JSON.stringify([historyItem, ...get().history]));
      } else {
        set({ currentResults: result, isLoading: false });
      }
      
      return result;
    } catch (error) {
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Query execution failed',
        response: 'There was an error executing your query'
      };
      
      set({ currentResults: errorResult, isLoading: false });
      return errorResult;
    }
  },
  
  clearResults: () => {
    set({ currentResults: null });
  },
  
  clearHistory: () => {
    set({ history: [] });
    localStorage.removeItem('query_history');
  },
}));