const API_BASE = '/api';

const getHeaders = (hasBody = true) => {
  const token = localStorage.getItem('rossele_token');
  const headers = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse(res);
  },

  async getProduct(idOrSlug) {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    return handleResponse(res);
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return handleResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse(res);
  },

  async getOrder(idOrNumber) {
    const res = await fetch(`${API_BASE}/orders/${idOrNumber}`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id, statusData) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData)
    });
    return handleResponse(res);
  },

  // Reviews
  async getReviews(productId) {
    const res = await fetch(`${API_BASE}/reviews/${productId}`);
    return handleResponse(res);
  },

  async createReview(productId, reviewData) {
    const res = await fetch(`${API_BASE}/reviews/${productId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    return handleResponse(res);
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return handleResponse(res);
  },

  // Contact
  async submitContact(contactData) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contactData)
    });
    return handleResponse(res);
  },

  async getContactMessages() {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  // Admin Analytics & Management
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders(false)
    });
    return handleResponse(res);
  }
};
