const API_BASE_URL = '/api';

class APIClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('bond_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('bond_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('bond_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Auth
  async register(email: string, password: string, name?: string, partnerName?: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, partnerName }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Chat / Sessions
  async createSession(title?: string, topic?: string) {
    return this.request('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ title, topic }),
    });
  }

  async getSessions() {
    return this.request('/chat/sessions');
  }

  async getSession(sessionId: string) {
    return this.request(`/chat/sessions/${sessionId}`);
  }

  async sendMessage(sessionId: string, message: string) {
    return this.request(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getTopics() {
    return this.request('/chat/topics');
  }

  async startTopicSession(sessionId: string, topic: string) {
    return this.request(`/chat/sessions/${sessionId}/topic`, {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }

  async reframeStatement(statement: string) {
    return this.request('/chat/reframe', {
      method: 'POST',
      body: JSON.stringify({ statement }),
    });
  }

  // Goals
  async createGoal(title: string, description?: string) {
    return this.request('/goals', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async getGoals() {
    return this.request('/goals');
  }

  async getGoalSuggestion() {
    return this.request('/goals/suggestion');
  }

  async incrementStreak(goalId: string) {
    return this.request(`/goals/${goalId}/streak`, {
      method: 'POST',
    });
  }

  async completeGoal(goalId: string) {
    return this.request(`/goals/${goalId}/complete`, {
      method: 'POST',
    });
  }

  // Checkins
  async createCheckin(mood: number, notes?: string) {
    return this.request('/goals/checkins', {
      method: 'POST',
      body: JSON.stringify({ mood, notes }),
    });
  }

  async getCheckins(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/goals/checkins${query}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const api = new APIClient();
export default api;
