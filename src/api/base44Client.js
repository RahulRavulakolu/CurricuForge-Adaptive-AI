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
        const resp = await fetch('/api/curricula', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error('Failed to create curriculum');
        return await resp.json();
      },
      list: async () => {
        const resp = await fetch('/api/curricula');
        if (!resp.ok) throw new Error('Failed to fetch curricula');
        return await resp.json();
      },
      get: async (id) => {
        const resp = await fetch(`/api/curricula/${id}`);
        if (!resp.ok) throw new Error('Failed to fetch curriculum');
        return await resp.json();
      },
      update: async (id, data) => {
        const resp = await fetch(`/api/curricula/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error('Failed to update curriculum');
        return await resp.json();
      },
      delete: async (id) => {
        const resp = await fetch(`/api/curricula/${id}`, {
          method: 'DELETE'
        });
        if (!resp.ok) throw new Error('Failed to delete curriculum');
        return await resp.json();
      }
    },
    Course: {
      create: async (data) => {
        const resp = await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!resp.ok) throw new Error('Failed to create course');
        return await resp.json();
      },
      list: async () => {
        const resp = await fetch('/api/courses');
        if (!resp.ok) throw new Error('Failed to fetch courses');
        return await resp.json();
      },
      get: async (id) => {
        const resp = await fetch(`/api/courses/${id}`);
        if (!resp.ok) throw new Error('Failed to fetch course');
        return await resp.json();
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
