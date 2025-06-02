import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface QueryResponse {
  success: boolean;
  sql_query?: string;
  results?: any[];
  response?: string;
  results_count?: number;
  error?: string;
}

export const databaseService = {
  async executeQuery(question: string): Promise<QueryResponse> {
    try {
      const response = await axios.post(`${API_URL}/query`, { question });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data?.message || 'Error executing query',
        };
      }
      return {
        success: false,
        error: 'Unknown error occurred',
      };
    }
  },

  async getDatabaseStats() {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching database stats:', error);
      return null;
    }
  },

  async testConnection(connectionDetails: any) {
    try {
      const response = await axios.post(`${API_URL}/test-connection`, connectionDetails);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Connection failed');
      }
      throw new Error('Connection failed');
    }
  }
};