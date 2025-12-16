import { Platform } from 'react-native';

const API_CONFIG = {
  // Для разработки на эмуляторе
  development: {
    android: 'http://10.0.2.2:3000', // 10.0.2.2 - специальный адрес для Android эмулятора
    ios: 'http://localhost:3000', // localhost работает в iOS симуляторе
    web: 'http://localhost:3000', // localhost для веб-браузера
  },
  
  // Для разработки на физическом устройстве
  // ВАЖНО: Замените IP адрес на адрес вашего компьютера в локальной сети
  // Узнать IP: Windows (ipconfig), Mac/Linux (ifconfig или ip addr)
  // Убедитесь, что устройство и компьютер в одной Wi-Fi сети
  // Можно задать через переменную окружения: EXPO_PUBLIC_API_IP=192.168.1.100
  physical: {
    android: process.env.EXPO_PUBLIC_API_IP ? `http://${process.env.EXPO_PUBLIC_API_IP}:3000` : 'http://192.168.100.5:3000',
    ios: process.env.EXPO_PUBLIC_API_IP ? `http://${process.env.EXPO_PUBLIC_API_IP}:3000` : 'http://192.168.100.5:3000',
    web: 'http://localhost:3000',
  },
  
  production: {
    android: 'http://localhost:3000',
    ios: 'http://localhost:3000',
    web: 'http://localhost:3000',
  },
};
// Определяем режим на основе окружения
// __DEV__ - true в development режиме Expo
// process.env.EXPO_PUBLIC_ENV - можно задать через переменные окружения
const getMode = (): 'development' | 'physical' | 'production' => {
  // Если задана переменная окружения, используем её (приоритет)
  if (process.env.EXPO_PUBLIC_ENV === 'production') {
    return 'production';
  }
  if (process.env.EXPO_PUBLIC_ENV === 'physical') {
    return 'physical';
  }
  if (process.env.EXPO_PUBLIC_ENV === 'development') {
    return 'development';
  }
  
  // В production билде __DEV__ будет false
  if (__DEV__) {
    // По умолчанию в dev режиме используем physical для физических устройств
    // Для эмуляторов установите EXPO_PUBLIC_ENV=development
    return 'physical';
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
  orders: {
    create: `${API_URL}/api/orders`,
  },
};

console.log('🌐 API Configuration:');
console.log(`   Mode: ${MODE}`);
console.log(`   Platform: ${Platform.OS}`);
console.log(`   API URL: ${API_URL}`);
console.log(`   Orders endpoint: ${API_ENDPOINTS.orders.create}`);
if (MODE === 'development' && Platform.OS !== 'web') {
  console.warn('⚠️ ВНИМАНИЕ: Используется режим development с localhost');
  console.warn('   Для физического устройства установите: EXPO_PUBLIC_ENV=physical');
  console.warn('   Или измените IP адрес в physical конфигурации');
}

