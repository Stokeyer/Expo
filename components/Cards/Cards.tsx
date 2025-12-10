import { View, Text, Image, Pressable, ScrollView, Animated, Dimensions, Easing } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToast } from '../../hooks/useToast';

type CardsProps = {
  onClose: () => void;
  onAddToCart: (item: any, quantity: number) => void;
  item: {
    id: number;
    name: string;
    compound: string;
    price: number;
    image: string;
    category?: string;
  };
};

export function Cards({ onClose, item, onAddToCart }: CardsProps) {
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Animations for different elements
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const badgesOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;
  const infoCardsOpacity = useRef(new Animated.Value(0)).current;
  const infoCardsSlide = useRef(new Animated.Value(15)).current;
  const bottomBarSlide = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Sequential animations after main slide
      Animated.stagger(60, [
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(badgesOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(contentSlide, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(infoCardsOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(infoCardsSlide, {
            toValue: 0,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(bottomBarSlide, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

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

  return (
    <>
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black"
        style={{ opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }}>
        <Pressable className="flex-1" onPress={handleClose} />
      </Animated.View>

      {/* Card Modal */}
      <Animated.View
        className="absolute inset-0 bg-white"
        style={{ transform: [{ translateY: slideAnim }] }}>
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 140 + Math.max(insets.bottom, 16) }}>
          <View className="relative">
            <Animated.View style={{ opacity: imageOpacity }}>
              <Image
                source={{ uri: item.image }}
                className="w-full h-[300px]"
                resizeMode="cover"
              />
            </Animated.View>
            
            {/* Back Button */}
            <Animated.View style={{ opacity: buttonsOpacity }} className="absolute top-12 left-4">
              <Pressable
                onPress={handleClose}
                className="w-10 h-10 bg-white rounded-full items-center justify-center"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 3,
                }}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2}>
                  <Path d="M19 12H5M12 19l-7-7 7-7" />
                </Svg>
              </Pressable>
            </Animated.View>

            {/* Category Badge */}
            {item.category && (
              <Animated.View style={{ opacity: badgesOpacity }} className="absolute bottom-4 right-4">
                <View className="bg-white rounded-full px-4 py-1.5">
                  <Text className="text-sm font-medium text-neutral-700">{item.category}</Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Content */}
          <Animated.View 
            className="px-6 py-6"
            style={{ 
              opacity: contentOpacity,
              transform: [{ translateY: contentSlide }]
            }}>
            <Text className="text-2xl font-bold text-neutral-900">{item.name}</Text>
            <Text className="mt-3 text-sm text-neutral-500 leading-5">{item.compound}</Text>

            {/* Info Cards */}
            <Animated.View 
              className="flex-row gap-3 mt-6"
              style={{
                opacity: infoCardsOpacity,
                transform: [{ translateY: infoCardsSlide }]
              }}>
              <View className="flex-1 bg-red-50 rounded-2xl p-4">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2}>
                  <Path d="M12 2v10l8 4-8-4-8 4 8-4V2z" />
                </Svg>
                <Text className="mt-2 text-xs text-neutral-500">Калории</Text>
                <Text className="mt-1 text-base font-semibold text-neutral-900">320 ккал</Text>
              </View>

              <View className="flex-1 bg-red-50 rounded-2xl p-4">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={2}>
                  <Path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                  <Path d="M12 6v6l4 2" />
                </Svg>
                <Text className="mt-2 text-xs text-neutral-500">Время</Text>
                <Text className="mt-1 text-base font-semibold text-neutral-900">25-30 мин</Text>
              </View>
            </Animated.View>

            {/* Ingredients */}
            <View className="mt-6">
              <Text className="text-lg font-semibold text-neutral-900">Состав</Text>
              <View className="mt-3 bg-red-50 rounded-2xl p-4">
                <Text className="text-sm text-neutral-600 leading-5">{item.compound}</Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Bottom Bar */}
        <Animated.View
          className="px-6 py-4 bg-white border-t border-neutral-200"
          style={{
            transform: [{ translateY: bottomBarSlide }],
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -2 },
            elevation: 5,
          }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-neutral-500">Цена</Text>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-neutral-100 items-center justify-center">
                <Text className="text-xl font-semibold text-neutral-700">-</Text>
              </Pressable>
              <Text className="text-lg font-semibold text-neutral-900 min-w-[30px] text-center">
                {quantity}
              </Text>
              <Pressable
                onPress={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-red-500 items-center justify-center">
                <Text className="text-xl font-semibold text-white">+</Text>
              </Pressable>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-red-500">{item.price * quantity} ₽</Text>
            <Pressable 
              className="flex-1 ml-4 bg-red-500 rounded-2xl py-4 items-center"
              onPress={() => {
                if (onAddToCart) {
                  onAddToCart(item, quantity);
                  toast.success(`Добавлено в корзину: ${item.name} x${quantity}`);
                }
              }}>
              <Text className="text-base font-semibold text-white">Добавить в корзину</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </>
  );
}
