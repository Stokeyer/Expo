import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Address = {
  id: string;
  name: string;
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  comment?: string;
  isDefault: boolean;
};

const ADDRESS_STORAGE_KEY = 'userAddresses';

export function useAddress() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressReady, setIsAddressReady] = useState(false);

  // Загрузка адресов из AsyncStorage при инициализации
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const stored = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Address[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAddresses(parsed);
          }
        }
      } catch (e) {
        console.log('Не удалось загрузить адреса из хранилища', e);
      } finally {
        setIsAddressReady(true);
      }
    };

    loadAddresses();
  }, []);

  // Сохранение адресов в AsyncStorage при каждом изменении
  useEffect(() => {
    if (isAddressReady) {
      const saveAddresses = async () => {
        try {
          await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
        } catch (e) {
          console.log('Не удалось сохранить адреса в хранилище', e);
        }
      };

      saveAddresses();
    }
  }, [addresses, isAddressReady]);

  const addAddress = useCallback((address: Address) => {
    setAddresses((prev) => {
      const newAddresses = [...prev, address];
      return newAddresses;
    });
  }, []);

  const updateAddress = useCallback((id: string, updatedAddress: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updatedAddress } : addr))
    );
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr.id === id }))
    );
  }, []);

  const getDefaultAddress = useCallback((): Address | null => {
    return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
  }, [addresses]);

  const formatAddress = useCallback((address: Address): string => {
    let formatted = `${address.street}, д. ${address.house}`;
    if (address.apartment) {
      formatted += `, кв. ${address.apartment}`;
    }
    return formatted;
  }, []);

  return {
    addresses,
    setAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    formatAddress,
    isAddressReady,
  } as const;
}
