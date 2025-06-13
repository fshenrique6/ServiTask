const API_BASE_URL = 'http://localhost:8083/api';

class ApiService {
  
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no login');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async register(name, email, password, confirmPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          confirmPassword 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no cadastro');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao obter dados do usuário');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      throw error;
    }
  }

  async checkEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar email');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async getBoards() {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar boards');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter boards:', error);
      throw error;
    }
  }

  async getBoard(boardId) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar board');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter board:', error);
      throw error;
    }
  }

  async createBoard(name) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar board');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar board:', error);
      throw error;
    }
  }

  async updateBoard(boardId, name) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar board');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar board:', error);
      throw error;
    }
  }

  async deleteBoard(boardId) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao deletar board:', error);
      throw error;
    }
  }

  async addColumn(boardId, name) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar coluna');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar coluna:', error);
      throw error;
    }
  }

  async updateColumn(boardId, columnId, name) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar coluna');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar coluna:', error);
      throw error;
    }
  }

  async removeColumn(boardId, columnId) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao remover coluna:', error);
      throw error;
    }
  }

  async addCard(boardId, columnId, title, description = '', priority = 'media') {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}/cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, priority }),
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar card');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar card:', error);
      throw error;
    }
  }

  async updateCard(boardId, columnId, cardId, title, description = '', priority = 'media') {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, priority }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar card');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      throw error;
    }
  }

  async removeCard(boardId, columnId, cardId) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao remover card:', error);
      throw error;
    }
  }

  async moveCard(boardId, cardId, targetColumnId, targetPosition = null) {
    try {
      const token = this.getAuthToken();
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`${API_BASE_URL}/boards/${boardId}/cards/${cardId}/move`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetColumnId, targetPosition }),
      });

      if (!response.ok) {
        throw new Error('Erro ao mover card');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao mover card:', error);
      throw error;
    }
  }
}

const apiService = new ApiService();
export default apiService; 