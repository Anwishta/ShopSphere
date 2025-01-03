export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://shop-sphere-liard.vercel.app/'
  : '';
export const USERS_URL = '/api/users'
export const CATEGORY_URL = '/api/category'
export const PRODUCT_URL = '/api/products'
export const UPLOAD_URL = '/api/upload'
// export const REACT_APP_API_URL= 'https://shopsphere-backend-9xia.onrender.com'


export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'; // Fallback for local development

export const USERS_URL = `${BASE_URL}/api/users`;
export const CATEGORY_URL = `${BASE_URL}/api/category`;
export const PRODUCT_URL = `${BASE_URL}/api/products`;
export const UPLOAD_URL = `${BASE_URL}/api/upload`;
