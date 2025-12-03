import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_USER_KEY = 'authUser';

export type AuthUser = {
  email: string;
  name: string;
};

export function useAuthSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<AuthUser>;
          if (parsed.email && parsed.name) {
            setUserEmail(parsed.email);
            setUserName(parsed.name);
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.log('Не удалось восстановить сессию авторизации', e);
      } finally {
        setIsAuthReady(true);
      }
    };

    restoreAuth();
  }, []);

  const login = async (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name);
    setIsAuthenticated(true);

    try {
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email, name } satisfies AuthUser));
    } catch (e) {
      console.log('Не удалось сохранить сессию авторизации', e);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');

    try {
      await AsyncStorage.removeItem(AUTH_USER_KEY);
    } catch (e) {
      console.log('Не удалось очистить сессию авторизации', e);
    }
  };

  return {
    isAuthenticated,
    isAuthReady,
    userEmail,
    userName,
    login,
    logout,
  } as const;
}
