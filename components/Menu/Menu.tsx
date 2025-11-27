import { View, Text, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import Svg, { Path } from 'react-native-svg';

export function Menu() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotate, {
        toValue: 1,
        duration: 800,
        delay: 200,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Бесконечная анимация пульсации
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    
    setTimeout(() => pulseAnimation.start(), 1000);

    return () => pulseAnimation.stop();
  }, []);

  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="items-center"
      >
        <Animated.View
          style={{
            transform: [{ scale: iconScale }, { rotate: spin }],
          }}
        >
          <Svg width={120} height={120} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M4 12h16M4 6h16M4 18h16" />
          </Svg>
        </Animated.View>
        
        <Text className="mt-8 text-2xl font-semibold text-neutral-900">Меню</Text>
        <Text className="mt-4 text-base text-neutral-500 text-center">
          Раздел в разработке
        </Text>
        <Text className="mt-2 text-sm text-neutral-400 text-center">
          Скоро здесь появится полное меню
        </Text>
      </Animated.View>
    </View>
  );
}

