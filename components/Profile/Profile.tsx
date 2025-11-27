import { View, Text, Animated, Easing } from 'react-native';
import { useEffect, useRef } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function Profile() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

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
    ]).start();

    // Волновая анимация для эффекта пульсации
    const createWaveAnimation = (animValue: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    const animations = [
      createWaveAnimation(wave1, 0),
      createWaveAnimation(wave2, 400),
      createWaveAnimation(wave3, 800),
    ];

    setTimeout(() => {
      animations.forEach(anim => anim.start());
    }, 1000);

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="items-center relative"
      >
        {/* Волны пульсации */}
        <View className="absolute items-center justify-center">
          {[wave1, wave2, wave3].map((wave, index) => (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: '#dc2626',
                opacity: wave.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 0.25, 0],
                }),
                transform: [
                  {
                    scale: wave.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
              }}
            />
          ))}
        </View>

        <Animated.View
          style={{
            transform: [{ scale: iconScale }],
          }}
        >
          <View
            className="bg-red-50 rounded-full p-8"
            style={{
              shadowColor: '#dc2626',
              shadowOpacity: 0.2,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 4 },
              elevation: 5,
            }}
          >
            <Svg width={80} height={80} viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <Circle cx="12" cy="7" r="4" />
            </Svg>
          </View>
        </Animated.View>
        
        <Text className="mt-8 text-2xl font-semibold text-neutral-900">Профиль</Text>
        <Text className="mt-4 text-base text-neutral-500 text-center">
          Раздел в разработке
        </Text>
        <Text className="mt-2 text-sm text-neutral-400 text-center">
          Скоро здесь появится личный кабинет
        </Text>
      </Animated.View>
    </View>
  );
}

