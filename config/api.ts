import { Platform } from 'react-native';

const API_CONFIG = {
  // Для разработки на эмуляторе
  development: {
    android: 'http://146.103.118.246:3000',
    ios: 'http://146.103.118.246:3000',
    web: 'http://146.103.118.246:3000',
  },
  
  // Для разработки на физическом устройстве
  physical: {
    android: 'http://146.103.118.246:3000',
    ios: 'http://146.103.118.246:3000',
    web: 'http://146.103.118.246:3000',
  },
  
  production: {
    android: 'http://146.103.118.246:3000',
    ios: 'http://146.103.118.246:3000',
    web: 'http://146.103.118.246:3000',
  },
};
// Определяем режим на основе окружения
// __DEV__ - true в development режиме Expo
// process.env.EXPO_PUBLIC_ENV - можно задать через переменные окружения
const getMode = (): 'development' | 'physical' | 'production' => {
  // Если задана переменная окружения, используем её
  if (process.env.EXPO_PUBLIC_ENV === 'production') {
    return 'production';
  }
  if (process.env.EXPO_PUBLIC_ENV === 'physical') {
    return 'physical';
  }
  // В production билде __DEV__ будет false
  if (__DEV__) {
    return 'development';
  }
  // По умолчанию для production билдов
  return 'production';
};

const MODE = getMode();

// Получить URL для текущей платформы
export const getApiUrl = (): string => {
  const config = API_CONFIG[MODE];
  
  if (Platform.OS === 'android') {
    return config.android;
  } else if (Platform.OS === 'ios') {
    return config.ios;
  } else {
    return config.web;
  }
};

// Экспорт базового URL
export const API_URL = getApiUrl();

// Экспорт эндпоинтов
export const API_ENDPOINTS = {
  auth: {
    register: `${API_URL}/api/auth/register`,
    login: `${API_URL}/api/auth/login`,
    profile: `${API_URL}/api/auth/profile`,
  },
  items: {
    getAll: `${API_URL}/api/items`,
    getByCategory: (category: string) => `${API_URL}/api/items?category=${category}`,
    getCategories: `${API_URL}/api/items/categories`,
    getById: (id: number) => `${API_URL}/api/items/${id}`,
  },
};

console.log('🌐 API Configuration:');
console.log(`   Mode: ${MODE}`);
console.log(`   Platform: ${Platform.OS}`);
console.log(`   API URL: ${API_URL}`);

