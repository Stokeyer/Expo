import { View, Text, ScrollView, Pressable, TextInput, Alert, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../../hooks/useToast';
import { useAddress, Address } from '../../../hooks/useAddress';

function AnimatedPressable({ 
  onPress, 
  children, 
  className 
}: { 
  onPress: () => void; 
  children: React.ReactNode;
  className?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={className}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

type AddressSettingsProps = {
  onBack: () => void;
  autoOpenForm?: boolean;
};

export function AddressSettings({ onBack, autoOpenForm }: AddressSettingsProps) {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAddress();
  const [isAdding, setIsAdding] = useState(false);

  // Автоматически открываем форму, если требуется
  useEffect(() => {
    if (autoOpenForm && addresses.length === 0) {
      setIsAdding(true);
    }
  }, [autoOpenForm, addresses.length]);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    street: '',
    house: '',
    apartment: '',
    entrance: '',
    floor: '',
    comment: '',
  });

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.house) {
      toast.error('Заполните обязательные поля: название, улица, дом');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      name: newAddress.name || '',
      street: newAddress.street || '',
      house: newAddress.house || '',
      apartment: newAddress.apartment,
      entrance: newAddress.entrance,
      floor: newAddress.floor,
      comment: newAddress.comment,
      isDefault: addresses.length === 0,
    };

    addAddress(address);
    setNewAddress({
      name: '',
      street: '',
      house: '',
      apartment: '',
      entrance: '',
      floor: '',
      comment: '',
    });
    setIsAdding(false);
    toast.success('Адрес добавлен');
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Удалить адрес',
      'Вы уверены, что хотите удалить этот адрес?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteAddress(id);
            toast.success('Адрес удален');
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
    toast.success('Адрес по умолчанию изменен');
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Шапка */}
        <View 
          className="bg-red-500 px-6 pb-6 rounded-b-3xl"
          style={{ paddingTop: Math.max(insets.top, 20) + 20 }}
        >
          <View className="flex-row items-center">
            <AnimatedPressable onPress={onBack} className="mr-4">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M19 12H5M12 19l-7-7 7-7" />
              </Svg>
            </AnimatedPressable>
            <Text className="text-xl font-semibold text-white flex-1">Адреса доставки</Text>
          </View>
        </View>

        <View className="px-6 mt-6">
          {/* Список адресов */}
          {addresses.map((address) => (
            <View key={address.id} className="bg-white rounded-2xl p-4 mb-4 border border-neutral-200">
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-semibold text-neutral-900">{address.name}</Text>
                    {address.isDefault && (
                      <View className="ml-2 px-2 py-0.5 bg-red-100 rounded-full">
                        <Text className="text-xs font-medium text-red-600">По умолчанию</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-neutral-600">
                    {address.street}, д. {address.house}
                    {address.apartment && `, кв. ${address.apartment}`}
                    {address.entrance && `, подъезд ${address.entrance}`}
                    {address.floor && `, этаж ${address.floor}`}
                  </Text>
                  {address.comment && (
                    <Text className="text-xs text-neutral-500 mt-1">{address.comment}</Text>
                  )}
                </View>
              </View>
              <View className="flex-row mt-3">
                {!address.isDefault && (
                  <AnimatedPressable
                    onPress={() => handleSetDefault(address.id)}
                    className="flex-1 mr-2 px-4 py-2 bg-red-50 rounded-xl items-center"
                  >
                    <Text className="text-sm font-medium text-red-600">Сделать основным</Text>
                  </AnimatedPressable>
                )}
                <AnimatedPressable
                  onPress={() => handleDeleteAddress(address.id)}
                  className="px-4 py-2 bg-neutral-100 rounded-xl"
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </Svg>
                </AnimatedPressable>
              </View>
            </View>
          ))}

          {/* Форма добавления адреса */}
          {isAdding ? (
            <View className="bg-white rounded-2xl p-4 mb-4 border border-neutral-200" style={{ minWidth: '100%' }}>
              <Text className="text-base font-semibold text-neutral-900 mb-4">Новый адрес</Text>
              
              <TextInput
                className="bg-neutral-50 rounded-xl px-4 py-3 mb-3 text-base"
                placeholder="Название (Дом, Работа и т.д.)"
                value={newAddress.name}
                onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
              />
              
              <TextInput
                className="bg-neutral-50 rounded-xl px-4 py-3 mb-3 text-base"
                placeholder="Улица *"
                value={newAddress.street}
                onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
              />
              
              <View className="flex-row mb-3">
                <TextInput
                  className="flex-1 bg-neutral-50 rounded-xl px-4 py-3 mr-2 text-base"
                  placeholder="Дом *"
                  value={newAddress.house}
                  onChangeText={(text) => setNewAddress({ ...newAddress, house: text })}
                />
                <TextInput
                  className="flex-1 bg-neutral-50 rounded-xl px-4 py-3 text-base"
                  placeholder="Квартира"
                  value={newAddress.apartment}
                  onChangeText={(text) => setNewAddress({ ...newAddress, apartment: text })}
                />
              </View>
              
              <View className="flex-row mb-3">
                <TextInput
                  className="flex-1 bg-neutral-50 rounded-xl px-4 py-3 mr-2 text-base"
                  placeholder="Подъезд"
                  value={newAddress.entrance}
                  onChangeText={(text) => setNewAddress({ ...newAddress, entrance: text })}
                />
                <TextInput
                  className="flex-1 bg-neutral-50 rounded-xl px-4 py-3 text-base"
                  placeholder="Этаж"
                  value={newAddress.floor}
                  onChangeText={(text) => setNewAddress({ ...newAddress, floor: text })}
                />
              </View>
              
              <TextInput
                className="bg-neutral-50 rounded-xl px-4 py-3 mb-4 text-base"
                placeholder="Комментарий для курьера"
                value={newAddress.comment}
                onChangeText={(text) => setNewAddress({ ...newAddress, comment: text })}
                multiline
                numberOfLines={3}
              />
              
              <View className="flex-row gap-3" style={{ minHeight: 56 }}>
                <AnimatedPressable
                  onPress={() => {
                    setIsAdding(false);
                    setNewAddress({
                      name: '',
                      street: '',
                      house: '',
                      apartment: '',
                      entrance: '',
                      floor: '',
                      comment: '',
                    });
                  }}
                  className="flex-1 py-5 px-6 bg-neutral-100 rounded-2xl items-center justify-center"
                  style={{
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  <Text className="text-lg font-semibold text-neutral-700">Отмена</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  onPress={handleAddAddress}
                  className="flex-1 py-5 px-6 bg-red-500 rounded-2xl items-center justify-center"
                  style={{
                    shadowColor: '#dc2626',
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 4,
                  }}
                >
                  <Text className="text-lg font-semibold text-white">Сохранить</Text>
                </AnimatedPressable>
              </View>
            </View>
          ) : (
            <AnimatedPressable
              onPress={() => setIsAdding(true)}
              className="bg-white rounded-2xl p-6 mb-24 border-2 border-dashed border-neutral-300 items-center"
            >
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <Path d="M12 5v14M5 12h14" />
              </Svg>
              <Text className="text-lg font-semibold text-red-500">Добавить адрес</Text>
            </AnimatedPressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
