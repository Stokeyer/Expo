import { Platform } from 'react-native';

// Конфигурация API URL
const API_CONFIG = {
  // Для разработки на эмуляторе
  development: {
    android: 'http://10.0.2.2:3000',
    ios: 'http://localhost:3000',
    web: 'http://localhost:3000',
  },
  
  // Для разработки на физическом устройстве
  physical: {
    android: 'http://192.168.100.2:3000',
    ios: 'http://192.168.100.2:3000',
    web: 'http://localhost:3000',
  },
  
  // Для production
  production: {
    android: 'https://api.rollshousepizza.com',
    ios: 'https://api.rollshousepizza.com',
    web: 'https://api.rollshousepizza.com',
  },
};

// Выберите режим: 'development' | 'physical' | 'production'
// 'development' - для Android эмулятора (10.0.2.2)
// 'physical' - для физического устройства (192.168.100.2)
// 'production' - для продакшена
const MODE: 'development' | 'physical' | 'production' = 'physical';

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
};

// Вывод в консоль для отладки
console.log('🌐 API Configuration:');
console.log(`   Mode: ${MODE}`);
console.log(`   Platform: ${Platform.OS}`);
console.log(`   API URL: ${API_URL}`);

