import { View, Text, Pressable, Animated, Dimensions, PanResponder, ScrollView, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAddress } from '../../hooks/useAddress';
import { useToast } from '../../hooks/useToast';
import { API_ENDPOINTS } from '../../config/api';

type CartItem = {
  id: number;
  name: string;
  compound: string;
  price: number;
  image: string;
  quantity: number;
};

type CheckoutProps = {
  visible: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalPrice: number;
  onConfirm: () => void;
  onNavigateToAddress?: () => void;
};

function AnimatedButton({ 
  onPress, 
  children, 
  className,
  disabled = false
}: { 
  onPress: () => void; 
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: disabled ? 0.5 : 1 }}>
      <Pressable 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={className}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export function Checkout({ visible, onClose, cartItems, totalPrice, onConfirm, onNavigateToAddress }: CheckoutProps) {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const { getDefaultAddress, formatAddress, addresses } = useAddress();
  const toast = useToast();
  const [comment, setComment] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState<string>('Загрузка адреса...');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      const defaultAddress = getDefaultAddress();
      if (defaultAddress) {
        setAddress(formatAddress(defaultAddress));
      } else {
        setAddress('Адрес не указан');
      }
    }
  }, [visible, getDefaultAddress, formatAddress]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: Dimensions.get('window').height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setComment('');
      setPhone('');
      onClose();
    });
  };

  const formatPhoneNumber = (text: string): string => {
    // Удаляем все нецифровые символы
    const cleaned = text.replace(/\D/g, '');
    
    // Форматируем номер: +7 (XXX) XXX-XX-XX
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+${cleaned}`;
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const validatePhone = (phoneNumber: string): boolean => {
    // Проверяем, что номер содержит минимум 11 цифр (7 + 10 цифр)
    const cleaned = phoneNumber.replace(/\D/g, '');
    return cleaned.length === 11 && cleaned.startsWith('7');
  };

  const handleConfirm = async () => {
    // Проверяем наличие адреса
    const defaultAddress = getDefaultAddress();
    if (!defaultAddress || addresses.length === 0) {
      toast.error('Необходимо указать адрес доставки');
      handleClose();
      if (onNavigateToAddress) {
        // Небольшая задержка для закрытия модального окна
        setTimeout(() => {
          onNavigateToAddress();
        }, 300);
      }
      return;
    }

    // Проверяем наличие и валидность номера телефона
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!phone || cleanedPhone.length === 0) {
      toast.error('Необходимо указать номер телефона');
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Укажите корректный номер телефона');
      return;
    }

    // Блокируем повторную отправку
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Формируем данные заказа
      const orderData = {
        phone: phone,
        address: formatAddress(defaultAddress),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalPrice,
        ...(comment.trim() && { comment: comment.trim() }),
      };

      console.log('📦 Отправка заказа:', orderData);
      console.log('🌐 URL:', API_ENDPOINTS.orders.create);

      // Отправляем заказ на бэкенд
      const response = await fetch(API_ENDPOINTS.orders.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Ошибка сервера' }));
        throw new Error(errorData.message || `Ошибка ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Заказ успешно отправлен:', result);

      toast.success('Заказ успешно оформлен!');
      onConfirm();
      handleClose();
    } catch (error: any) {
      console.error('❌ Ошибка при отправке заказа:', error);
      const errorMessage = error.message || 'Не удалось отправить заказ. Проверьте подключение к интернету.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <>
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }}
      >
        <Pressable className="flex-1" onPress={handleClose} />
      </Animated.View>

      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px]"
        style={{
          transform: [
            { translateY: Animated.add(slideAnim, panY) }
          ],
          minHeight: '70%',
          maxHeight: '90%',
        }}
      >
        <View className="items-center py-3" {...panResponder.panHandlers}>
          <View className="w-12 h-1 bg-neutral-300 rounded-full" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
            <Text className="text-xl font-semibold text-neutral-900">Оформление заказа</Text>
            <Pressable onPress={handleClose} className="p-2">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5}>
                <Path d="M18 6L6 18M6 6l12 12" />
              </Svg>
            </Pressable>
          </View>

          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Адрес доставки */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">Адрес доставки</Text>
              <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <View className="flex-row items-center gap-2 mb-1">
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2}>
                    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </Svg>
                  <Text className="text-base font-medium text-neutral-900 flex-1">{address}</Text>
                </View>
              </View>
            </View>

            {/* Номер телефона */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">Номер телефона</Text>
              <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <View className="flex-row items-center gap-2">
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2}>
                    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </Svg>
                  <TextInput
                    className="flex-1 text-1 font-medium text-neutral-900 items-center"
                    placeholder="+7 (999) 999-99-99"
                    placeholderTextColor="#9ca3af"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    maxLength={18}
                  />
                </View>
              </View>
            </View>

            {/* Способ оплаты */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">Способ оплаты</Text>
              <View className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <View className="flex-row items-center gap-2">
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2}>
                    <Path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </Svg>
                  <Text className="text-base font-medium text-neutral-900">Наличными при получении</Text>
                </View>
              </View>
            </View>

            {/* Комментарий к заказу */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-neutral-700 mb-2">Комментарий к заказу</Text>
              <TextInput
                className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-base text-neutral-900"
                placeholder="Добавьте комментарий (необязательно)"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
                style={{ textAlignVertical: 'top', minHeight: 100 }}
              />
            </View>

            {/* Состав заказа */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-neutral-700 mb-3">Состав заказа</Text>
              {cartItems.map((item) => (
                <View key={item.id} className="flex-row items-center justify-between mb-2 pb-2 border-b border-neutral-100">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-neutral-900">{item.name}</Text>
                    <Text className="text-xs text-neutral-500">x{item.quantity}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-neutral-900">
                    {item.price * item.quantity} ₽
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Итого и кнопка подтверждения */}
          <View 
            className="px-6 py-4 bg-white border-t border-neutral-200"
            style={{ paddingBottom: Math.max(16, insets.bottom) }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-neutral-900">Итого</Text>
              <Text className="text-2xl font-bold text-red-500">
                {totalPrice} ₽
              </Text>
            </View>
            <AnimatedButton 
              className="bg-red-500 rounded-2xl py-4 items-center" 
              onPress={handleConfirm}
              disabled={isSubmitting}
            >
              <Text className="text-base font-semibold text-white">
                {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
              </Text>
            </AnimatedButton>
          </View>
        </View>
      </Animated.View>
    </>
  );
}
