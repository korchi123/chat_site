import axios from 'axios'


const API_URL=`${process.env.REACT_APP_API_URL}/api`

const $host=axios.create({
        baseURL: API_URL,
        withCredentials: true
}
)
const $authHost = axios.create({
  baseURL: API_URL,
  withCredentials: true
});
$authHost.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
$authHost.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Если ошибка 401 и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Пытаемся обновить токены
        const response = await $host.get(`${API_URL}/user/refresh`, {
          withCredentials: true
        });
        
        // Сохраняем новый access token
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return $authHost(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить - разлогиниваем
        localStorage.removeItem('accessToken');
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
export {$host, $authHost}