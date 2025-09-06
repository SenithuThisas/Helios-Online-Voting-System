const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyOTP(userId, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, otp }),
    });
  }

  async resendOTP(userId) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Election endpoints
  async getElections() {
    return this.request('/elections');
  }

  async getElection(id) {
    return this.request(`/elections/${id}`);
  }

  async vote(electionId, candidateId) {
    return this.request('/votes', {
      method: 'POST',
      body: JSON.stringify({ electionId, candidateId }),
    });
  }

  async getVotingHistory() {
    return this.request('/votes/history');
  }

  // Admin endpoints
  async createElection(electionData) {
    return this.request('/admin/elections', {
      method: 'POST',
      body: JSON.stringify(electionData),
    });
  }

  async createCandidate(candidateData) {
    return this.request('/admin/candidates', {
      method: 'POST',
      body: JSON.stringify(candidateData),
    });
  }

  async getElectionResults(electionId) {
    return this.request(`/admin/elections/${electionId}/results`);
  }
}

export default new ApiService();

