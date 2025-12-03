import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  id: number;
  name: string;
  compound: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_STORAGE_KEY = 'cartItems';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartReady, setIsCartReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  // Загрузка корзины из AsyncStorage при инициализации
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as CartItem[];
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch (e) {
        console.log('Не удалось загрузить корзину из хранилища', e);
      } finally {
        setIsCartReady(true);
      }
    };

    loadCart();
  }, []);

  // Сохранение корзины в AsyncStorage при каждом изменении
  useEffect(() => {
    if (isCartReady) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (e) {
          console.log('Не удалось сохранить корзину в хранилище', e);
        }
      };

      saveCart();
    }
  }, [cartItems, isCartReady]);

  const addToCart = useCallback((item: any, quantity: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      } else {
        newItems = [...prev, { ...item, quantity }];
      }
      return newItems;
    });
    setSelectedItem(null);
  }, []);

  const clearCart = useCallback(async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.log('Не удалось очистить корзину из хранилища', e);
    }
  }, []);

  const openBasket = () => setIsBasketOpen(true);
  const closeBasket = () => setIsBasketOpen(false);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    setCartItems,
    selectedItem,
    setSelectedItem,
    isBasketOpen,
    openBasket,
    closeBasket,
    addToCart,
    clearCart,
    cartItemsCount,
  } as const;
}
