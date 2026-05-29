const BASE_URL = 'https://fakestoreapi.com';

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const ApiService = {
  getProducts: async () => {
    const response = await fetch(`${BASE_URL}/products`);
    return handleResponse(response);
  },

  getProductById: async (id) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${BASE_URL}/products/categories`);
    return handleResponse(response);
  },

  getProductsByCategory: async (category) => {
    const encoded = encodeURIComponent(category);
    const response = await fetch(`${BASE_URL}/products/category/${encoded}`);
    return handleResponse(response);
  },
};
