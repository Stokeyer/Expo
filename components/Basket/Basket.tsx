import { View, Text, Pressable, Animated, Dimensions, PanResponder, Image, ScrollView } from 'react-native';
import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkout } from './Checkout';
import { useToast } from '../../hooks/useToast';

function AnimatedButton({ 
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
      toValue: 0.85,
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

const BasketItem = memo(function BasketItem({ 
  item, 
  onDecrease, 
  onIncrease,
  index 
}: { 
  item: CartItem; 
  onDecrease: () => void; 
  onIncrease: () => void;
  index: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 50,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <View className="flex-row bg-white rounded-2xl p-3 mb-3 border border-neutral-200">
        <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl" resizeMode="cover" />
        <View className="flex-1 ml-3 justify-between">
          <Text className="text-sm font-semibold text-neutral-900">{item.name}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-red-500">{item.price * item.quantity} ₽</Text>
            <View className="flex-row items-center gap-2">
              <AnimatedButton
                onPress={onDecrease}
                className="w-7 h-7 rounded-full bg-neutral-100 items-center justify-center"
              >
                <Text className="text-lg font-semibold text-neutral-700">-</Text>
              </AnimatedButton>
              <Text className="text-sm font-semibold text-neutral-900 min-w-[20px] text-center">
                {item.quantity}
              </Text>
              <AnimatedButton
                onPress={onIncrease}
                className="w-7 h-7 rounded-full bg-red-500 items-center justify-center"
              >
                <Text className="text-lg font-semibold text-white">+</Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

type CartItem = {
  id: number;
  name: string;
  compound: string;
  price: number;
  image: string;
  quantity: number;
};

type BasketProps = {
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  onNavigateToAddress?: () => void;
};

export function Basket({ onClose, cartItems, setCartItems, onNavigateToAddress }: BasketProps) {
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const toast = useToast();

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const handleDecrease = useCallback((itemId: number) => {
    setCartItems((prev) => {
      const item = prev.find(i => i.id === itemId);
      if (!item) return prev;
      if (item.quantity === 1) {
        return prev.filter(i => i.id !== itemId);
      }
      return prev.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, [setCartItems]);

  const handleIncrease = useCallback((itemId: number) => {
    setCartItems((prev) => {
      return prev.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
    });
  }, [setCartItems]);

  useEffect(() => {
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
  }, [slideAnim, fadeAnim]);

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
    ]).start(() => onClose());
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
          minHeight: '50%',
          maxHeight: '60%',
        }}
      >
        <View className="items-center py-3" {...panResponder.panHandlers}>
          <View className="w-12 h-1 bg-neutral-300 rounded-full" />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
            <Text className="text-xl font-semibold text-neutral-900">Корзина</Text>
            <Pressable onPress={handleClose} className="p-2">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2.5}>
                <Path d="M18 6L6 18M6 6l12 12" />
              </Svg>
            </Pressable>
          </View>

          {cartItems.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Svg width={120} height={120} viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <Path d="M3 6h18" />
                <Path d="M16 10a4 4 0 0 1-8 0" />
              </Svg>
              <Text className="mt-6 text-base font-medium text-neutral-500">Ваша корзина пуста</Text>
            </View>
          ) : (
            <>
              <ScrollView className="flex-1 px-6">
                {cartItems.map((item, index) => (
                  <BasketItem
                    key={item.id}
                    item={item}
                    index={index}
                    onDecrease={() => handleDecrease(item.id)}
                    onIncrease={() => handleIncrease(item.id)}
                  />
                ))}
              </ScrollView>
              
              <View 
                className="px-6 py-4 bg-white border-t border-neutral-200"
                style={{ paddingBottom: Math.max(16, insets.bottom) }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-base text-neutral-500">Итого</Text>
                  <Text className="text-2xl font-bold text-red-500">
                    {totalPrice} ₽
                  </Text>
                </View>
                <AnimatedButton 
                  className="bg-red-500 rounded-2xl py-4 items-center" 
                  onPress={() => setIsCheckoutOpen(true)}
                >
                  <Text className="text-base font-semibold text-white">Оформить заказ</Text>
                </AnimatedButton>
              </View>
            </>
          )}
        </View>
      </Animated.View>

      <Checkout
        visible={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        onConfirm={() => {
          // Здесь можно добавить логику отправки заказа
          setCartItems([]);
          toast.success('Заказ успешно оформлен!');
          handleClose();
        }}
        onNavigateToAddress={onNavigateToAddress}
      />
    </>
  );
}

