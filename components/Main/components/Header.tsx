import { View, Text, Pressable, Alert, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

function AnimatedAddressButton({ onPress, address }: { onPress: () => void; address: string }) {
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
        className="flex-row items-center"
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text className="text-base text-neutral-900">{address}</Text>
        <View className="ml-1">
          <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            stroke="#737373"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round">
            <Path d="m9 18 6-6-6-6" />
          </Svg>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function Header() {
  const [address] = useState('ул. Пушкина, 26');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(translateAnim, {
        toValue: 0,
        damping: 14,
        stiffness: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateAnim]);

  return (
    <Animated.View
      className="w-11/12 self-center rounded-3xl bg-white mt-14"
      style={{ opacity: fadeAnim, transform: [{ translateY: translateAnim }] }}>
      <Text className="text-base text-neutral-500">
        Доставка по улице
      </Text>

      <View className="mt-2.5 flex-row gap-2">
        <Svg
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <Circle cx="12" cy="10" r={3} />
        </Svg>

        <AnimatedAddressButton
          onPress={() =>
            Alert.alert('Тут должен быть переход на форму заполнения улицы')
          }
          address={address}
        />
      </View>

      <Text className="mt-8 text-2xl text-neutral-900 font-semibold">
        Добро пожаловать!
      </Text>
      <Text className="mt-5 text-base text-neutral-500">
        Лучшая японская кухня с доставкой
      </Text>
    </Animated.View>
  );
}
