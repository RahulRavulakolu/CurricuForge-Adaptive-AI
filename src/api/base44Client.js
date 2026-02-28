// Simple mock client to prevent MongoDB connection issues in browser
const mockBase44Client = {
  integrations: {
    Core: {
      InvokeLLM: async (opts = {}) => {
        console.log('Calling local LLM proxy with:', opts);
        const resp = await fetch('/api/llm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(opts)
        });

        if (!resp.ok) {
          const errorBody = await resp.text();
          throw new Error(`LLM proxy error: ${resp.status} ${errorBody}`);
        }

        const result = await resp.json();
        console.log('LLM proxy response:', result);
        return result;
      }
    }
  },
  entities: {
    Curriculum: {
      create: async (data) => {
        console.log('Mock curriculum creation (MongoDB disabled in browser):', data);
        // Save to localStorage instead of MongoDB for browser compatibility
        try {
          const existingData = JSON.parse(localStorage.getItem('curricula') || '[]');
          const newCurriculum = { id: 'curriculum-' + Date.now(), ...data, createdAt: new Date().toISOString() };
          existingData.push(newCurriculum);
          localStorage.setItem('curricula', JSON.stringify(existingData));
          return newCurriculum;
        } catch (error) {
          console.error('LocalStorage save failed:', error);
          return { id: 'mock-curriculum-' + Date.now(), ...data };
        }
      },
      list: async () => {
        try {
          const curricula = JSON.parse(localStorage.getItem('curricula') || '[]');
          return { items: curricula, total: curricula.length };
        } catch (error) {
          return { items: [], total: 0 };
        }
      },
      get: async (id) => {
        try {
          const curricula = JSON.parse(localStorage.getItem('curricula') || '[]');
          return curricula.find(c => c.id === id) || null;
        } catch (error) {
          return null;
        }
      },
      update: async (id, data) => {
        try {
          const curricula = JSON.parse(localStorage.getItem('curricula') || '[]');
          const index = curricula.findIndex(c => c.id === id);
          if (index !== -1) {
            curricula[index] = { ...curricula[index], ...data, updatedAt: new Date().toISOString() };
            localStorage.setItem('curricula', JSON.stringify(curricula));
          }
          return { id, data };
        } catch (error) {
          return { id, data };
        }
      },
      delete: async (id) => {
        try {
          const curricula = JSON.parse(localStorage.getItem('curricula') || '[]');
          const filtered = curricula.filter(c => c.id !== id);
          localStorage.setItem('curricula', JSON.stringify(filtered));
          return { success: true };
        } catch (error) {
          return { success: false };
        }
      },
      filter: async (query) => {
        try {
          const curricula = JSON.parse(localStorage.getItem('curricula') || '[]');
          return { items: curricula, total: curricula.length };
        } catch (error) {
          return { items: [], total: 0 };
        }
      },
      query: async (query) => {
        try {
          const curricula = JSON.parse(localStorage.getItem('curricula') || '[]');
          return { items: curricula, total: curricula.length };
        } catch (error) {
          return { items: [], total: 0 };
        }
      }
    }
  },
  appLogs: {
    logUserInApp: async (pageName) => {
      console.log('User navigation log:', pageName);
    },
    fetchLogs: async () => {
      return { logs: [] };
    },
    getStats: async () => {
      return { stats: {} };
    }
  },
  auth: {
    me: async () => ({ 
      id: 'mock-user', 
      email: 'user@example.com',
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      full_name: 'Mock User',
      disabled: false
    }),
    logout: () => console.log('Logout called'),
    redirectToLogin: () => console.log('Redirect to login called')
  }
};

export const base44 = mockBase44Client;
